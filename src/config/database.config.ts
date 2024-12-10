import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseConfig {
  constructor(private configService: ConfigService) {}

  getCustomerDbUrl(): string {
    return this.configService.get<string>('CUSTOMER_DATABASE_URL');
  }

  getCompanyDbUrl(): string {
    return this.configService.get<string>('COMPANY_DATABASE_URL');
  }
}
