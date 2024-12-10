import { UserType } from '../types/user-type.enum';

export interface JwtPayload {
  sub: number;
  email: string;
  userType: UserType;
  companyId?: number;
}
