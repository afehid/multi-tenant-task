import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/client';
import { UserType } from '../common/types/user-type.enum';
import * as bcrypt from 'bcrypt';
import { UpdateUserInput } from './dto/update-user.input';
import { CreateUserInput } from './dto/create-user.input';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(createUserInput: CreateUserInput) {
    const { email, password, userType, companyId, databaseUrl } =
      createUserInput;
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(createUserInput);
    if (userType === UserType.COMPANY) {
      const mainDbUser = await this.prisma.getMainClient().user.create({
        data: {
          email,
          password: hashedPassword,
          userType,
          companyId,
          databaseUrl,
        },
      });
      console.log(mainDbUser);
      const companyClient = await this.prisma.getClient(
        userType,
        null,
        databaseUrl,
      );
      await companyClient.user.create({
        data: {
          id: mainDbUser.id,
          email,
          password: hashedPassword,
          userType,
          companyId: mainDbUser.id,
          databaseUrl,
        },
      });

      return mainDbUser;
    }

    return this.prisma.getMainClient().user.create({
      data: {
        email,
        password: hashedPassword,
        userType,
      },
    });
  }

  async findOne(id: number, userType: UserType, companyId?: number) {
    const client = await this.prisma.getClient(userType, companyId);
    return client.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string, userType: UserType, companyId?: number) {
    const client = await this.prisma.getClient(userType, companyId);
    return client.user.findUnique({ where: { email } });
  }

  async update(
    id: number,
    userType: UserType,
    companyId: number | undefined,
    updateData: UpdateUserInput,
  ) {
    const client = await this.prisma.getClient(userType, companyId);

    const data: any = { ...updateData };
    if (updateData.password) {
      data.password = await bcrypt.hash(updateData.password, 10);
    }

    return client.user.update({
      where: { id },
      data,
    });
  }
}
