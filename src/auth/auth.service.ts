import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/client';
import * as bcrypt from 'bcrypt';
import { authenticator } from 'otplib';
import * as qrcode from 'qrcode';
import { UserType } from '../common/types/user-type.enum';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const client = await this.prisma.getClient(UserType.CUSTOMER);
    let user = await client.user.findUnique({ where: { email } });

    if (!user) {
      const companyUser = await this.prisma.getMainClient().user.findFirst({
        where: {
          email,
          userType: UserType.COMPANY,
        },
      });

      if (companyUser) {
        const companyClient = await this.prisma.getClient(
          UserType.COMPANY,
          companyUser.companyId,
        );
        user = await companyClient.user.findUnique({ where: { email } });
      }
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      userType: user.userType,
      companyId: user.companyId,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async generate2FASecret(
    userId: number,
    userType: UserType,
    companyId?: number,
  ) {
    const secret = authenticator.generateSecret();
    const client = await this.prisma.getClient(userType, companyId);

    await client.user.update({
      where: { id: userId },
      data: {
        twoFactorSecret: secret,
        twoFactorEnabled: true,
      },
    });

    const otpAuthUrl = authenticator.keyuri(
      userId.toString(),
      'API Gateway',
      secret,
    );

    return {
      secret,
      qrCode: await qrcode.toDataURL(otpAuthUrl),
    };
  }

  async verify2FAToken(
    userId: number,
    userType: UserType,
    token: string,
    companyId?: number,
  ) {
    const client = await this.prisma.getClient(userType, companyId);
    const user = await client.user.findUnique({ where: { id: userId } });

    if (!user?.twoFactorSecret) {
      throw new Error('2FA not set up for this user');
    }

    return authenticator.verify({
      token,
      secret: user.twoFactorSecret,
    });
  }
}
