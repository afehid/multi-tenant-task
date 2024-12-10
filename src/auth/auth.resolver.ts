import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { AuthResponse, TwoFactorResponse } from './dto/auth.dto';
import { UserType } from 'src/common/types/user-type.enum';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (user.userType === UserType.COMPANY && !user.twoFactorEnabled) {
      throw new Error('2FA not enabled for company user');
    }

    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => TwoFactorResponse)
  async enable2FA(@CurrentUser() user: User) {
    if (user.userType !== UserType.COMPANY) {
      throw new Error('2FA is only available for company users');
    }

    return this.authService.generate2FASecret(
      user.id,
      user.userType,
      user.companyId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async verify2FA(@CurrentUser() user: User, @Args('token') token: string) {
    if (user.userType !== UserType.COMPANY) {
      throw new Error('2FA is only available for company users');
    }

    return this.authService.verify2FAToken(
      user.id,
      user.userType,
      token,
      user.companyId,
    );
  }
}
