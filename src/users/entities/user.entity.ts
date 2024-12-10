import { ObjectType, Field, ID } from '@nestjs/graphql';
import { UserType } from '../../common/types/user-type.enum';

@ObjectType()
export class User {
  @Field(() => ID)
  id: number;

  @Field()
  email: string;

  @Field(() => UserType)
  userType: UserType;

  @Field({ nullable: true })
  companyId?: number;

  @Field({ nullable: true })
  databaseUrl?: string;

  @Field()
  twoFactorEnabled: boolean;

  @Field({ nullable: true })
  twoFactorSecret?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
