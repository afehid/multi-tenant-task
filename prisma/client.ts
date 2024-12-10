import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { UserType } from 'src/common/types/user-type.enum';

@Injectable()
export class PrismaService implements OnModuleInit {
  protected readonly defaultClient: PrismaClient;
  private companyClients: Map<string, PrismaClient> = new Map();

  constructor(private configService: ConfigService) {
    this.defaultClient = new PrismaClient({
      datasources: {
        db: {
          url: configService.get('DATABASE_URL'),
        },
      },
    });
  }

  async onModuleInit() {
    await this.defaultClient.$connect();
  }

  async onModuleDestroy() {
    await this.defaultClient.$disconnect();
    for (const client of this.companyClients.values()) {
      await client.$disconnect();
    }
  }

  private getCompanyClient(databaseUrl: string): PrismaClient {
    if (!this.companyClients.has(databaseUrl)) {
      const client = new PrismaClient({
        datasources: {
          db: {
            url: databaseUrl,
          },
        },
      });
      this.companyClients.set(databaseUrl, client);
    }
    return this.companyClients.get(databaseUrl);
  }

  getMainClient(): PrismaClient {
    return this.defaultClient;
  }

  async getClient(
    userType: UserType,
    companyId?: number,
    databaseUrl?: string,
  ): Promise<PrismaClient> {
    if (userType === UserType.CUSTOMER) {
      return this.defaultClient;
    }

    if (databaseUrl) {
      return this.getCompanyClient(databaseUrl);
    }

    if (companyId) {
      const company = await this.defaultClient.user.findFirst({
        where: {
          id: companyId,
          userType: UserType.COMPANY,
        },
      });

      if (!company?.databaseUrl) {
        throw new Error('Company database configuration not found');
      }

      return this.getCompanyClient(company.databaseUrl);
    }

    throw new Error(
      'Either companyId or databaseUrl must be provided for company users',
    );
  }
}
