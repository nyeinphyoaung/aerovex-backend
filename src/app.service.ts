import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  async onModuleInit() {
    await this.createSuperAdminUserIfNotExits();
  }

  private async createSuperAdminUserIfNotExits() {
    try {
      const superAdminEmail =
        this.configService.get<string>('SUPER_ADMIN_EMAIL');
      const superAdminName = this.configService.get<string>(
        'SUPER_ADMIN_NAME',
        'Super Admin',
      );
      const superAdminPassword = this.configService.get<string>(
        'SUPER_ADMIN_PASSWORD',
      );

      if (!superAdminEmail || !superAdminPassword) {
        this.logger.warn(
          'SUPER_ADMIN_EMAIL or SUPER_ADMIN_PASSWORD not set in environment variables.',
        );
        return;
      }

      const existingSuperAdmin = await this.prismaService.user.findFirst({
        where: {
          email: superAdminEmail,
        },
      });

      if (existingSuperAdmin) {
        this.logger.log('SuperAdmin is already exits. Skipping creation');
        return;
      }

      const hashPassword = await bcrypt.hash(superAdminPassword, 10);

      const superAdminRole = await this.prismaService.role.create({
        data: {
          name: 'Super Admin',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      this.logger.log('Role created successfully');

      const permissions = [
        { action: 'create', subject: 'user' },
        { action: 'view', subject: 'user' },
        { action: 'update', subject: 'user' },
        { action: 'delete', subject: 'user' },
        { action: 'upload_image', subject: 'user' },
        { action: 'create', subject: 'role' },
        { action: 'view', subject: 'role' },
        { action: 'update', subject: 'role' },
        { action: 'delete', subject: 'role' },
        //... add more permissions as you needed
      ];

      await this.prismaService.permission.createMany({
        data: permissions.map((permission) => ({
          ...permission,
          roleId: superAdminRole.id,
          createdAt: new Date(),
        })),
      });
      this.logger.log('Permissions created successfully for super admin role');

      const superAdminUser = await this.prismaService.user.create({
        data: {
          name: superAdminName,
          email: superAdminEmail,
          password: hashPassword,
          accountStatus: 'ACTIVE',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          roleId: superAdminRole.id,
        },
      });

      this.logger.log(
        `Super admin user created successfully: ${superAdminUser.email}`,
      );
    } catch (error) {
      this.logger.error('Failed to create super admin user:', error);
    }
  }
}
