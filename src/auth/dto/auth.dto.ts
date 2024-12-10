import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class AuthResponse {
  @Field()
  accessToken: string;
}

@ObjectType()
export class TwoFactorResponse {
  @Field()
  secret: string;

  @Field()
  qrCode: string;
}
