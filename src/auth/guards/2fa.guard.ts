import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserType } from '../../common/types/user-type.enum';

@Injectable()
export class TwoFactorGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext().req.user;

    if (user.userType === UserType.COMPANY && !user.twoFactorEnabled) {
      throw new Error('2FA required for company users');
    }

    return true;
  }
}
