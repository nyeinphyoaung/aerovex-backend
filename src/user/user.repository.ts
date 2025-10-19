import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserWithRoleAndPermission } from './types/user.type';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

const userValidator = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: {
    role: {
      include: {
        permissions: true,
      },
    },
  },
});

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(payload: CreateUserDto): Promise<UserWithRoleAndPermission> {
    return this.prismaService.user.create({
      data: {
        ...payload,
      },
      ...userValidator,
    });
  }

  async updateUser(
    id: string,
    payload: UpdateUserDto,
  ): Promise<UserWithRoleAndPermission> {
    return this.prismaService.user.update({
      where: { id },
      data: { ...payload },
      ...userValidator,
    });
  }

  async deleteUser(id: string): Promise<UserWithRoleAndPermission> {
    return this.prismaService.user.delete({
      where: { id },
      ...userValidator,
    });
  }

  async findAllUsers(): Promise<UserWithRoleAndPermission[]> {
    return this.prismaService.user.findMany({
      ...userValidator,
    });
  }

  async findUserById(id: string): Promise<UserWithRoleAndPermission | null> {
    return this.prismaService.user.findUnique({
      where: {
        id,
        deletedAt: { equals: null },
      },
      ...userValidator,
    });
  }

  async findUserByEmail(
    email: string,
  ): Promise<UserWithRoleAndPermission | null> {
    return this.prismaService.user.findUnique({
      where: {
        email,
        deletedAt: { equals: null },
      },
      ...userValidator,
    });
  }

  async getAllUserwithPaginated(
    page: number = 1,
    limit: number = 10,
    query?: string,
  ): Promise<{
    users: UserWithRoleAndPermission[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    // Build where clause for search
    const whereClause = query
      ? {
          AND: [
            {
              deletedAt: { equals: null },
            },
            {
              OR: [
                {
                  name: { contains: query, mode: 'insensitive' as const },
                },
                { email: { contains: query, mode: 'insensitive' as const } },
              ],
            },
          ],
        }
      : {
          deletedAt: { equals: null },
        };

    const [users, total] = await Promise.all([
      this.prismaService.user.findMany({
        ...userValidator,
        where: whereClause,
        skip,
        take: limit,
      }),
      this.prismaService.user.count({
        where: whereClause,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      users,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async softDeleteUser(id: string): Promise<UserWithRoleAndPermission> {
    return this.prismaService.user.update({
      where: { id },
      data: { deletedAt: new Date() },
      ...userValidator,
    });
  }

  async restoreUser(id: string): Promise<UserWithRoleAndPermission> {
    return this.prismaService.user.update({
      where: { id },
      data: { deletedAt: null },
      ...userValidator,
    });
  }

  async bulkSoftDeleteUsers(ids: string[]): Promise<void> {
    await this.prismaService.user.updateMany({
      where: {
        id: { in: ids },
      },
      data: { deletedAt: new Date() },
    });
  }

  async bulkRestoreUsers(ids: string[]): Promise<void> {
    await this.prismaService.user.updateMany({
      where: {
        id: { in: ids },
        deletedAt: { not: null },
      },
      data: { deletedAt: null },
    });
  }

  async findSoftDeletedUserById(
    id: string,
  ): Promise<UserWithRoleAndPermission | null> {
    return this.prismaService.user.findUnique({
      where: {
        id,
        deletedAt: { not: null },
      },
      ...userValidator,
    });
  }

  async findUsersByIds(ids: string[]): Promise<UserWithRoleAndPermission[]> {
    return this.prismaService.user.findMany({
      where: {
        id: { in: ids },
        deletedAt: { equals: null },
      },
      ...userValidator,
    });
  }

  async findSoftDeletedUsersByIds(
    ids: string[],
  ): Promise<UserWithRoleAndPermission[]> {
    return this.prismaService.user.findMany({
      where: {
        id: { in: ids },
        deletedAt: { not: null },
      },
      ...userValidator,
    });
  }
}
