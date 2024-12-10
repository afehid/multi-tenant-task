import { registerEnumType } from '@nestjs/graphql';

export enum UserType {
  CUSTOMER = 'CUSTOMER',
  COMPANY = 'COMPANY',
}

registerEnumType(UserType, {
  name: 'UserType',
  description: 'The type of user',
});
