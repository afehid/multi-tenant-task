import { InputType, Field } from '@nestjs/graphql';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { UserType } from '../../common/types/user-type.enum';

@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  password: string;

  @Field(() => UserType)
  @IsEnum(UserType)
  userType: UserType;

  @Field({ nullable: true })
  @ValidateIf((o) => o.userType === UserType.COMPANY)
  @IsOptional()
  companyId?: number;

  @Field({ nullable: true })
  @ValidateIf((o) => o.userType === UserType.COMPANY && !o.companyId)
  databaseUrl?: string;
}
