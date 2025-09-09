import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserDto } from './dtos/user.dto';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(payload: CreateUserDto): Promise<UserDto> {
    const exitsUser = await this.userRepository.findUserByEmail(payload.email);
    if (exitsUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const user = await this.userRepository.createUser({
      ...payload,
      password: hashedPassword,
    });

    return plainToInstance(UserDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async updateUser(id: string, payload: UpdateUserDto): Promise<UserDto> {
    const exitsUser = await this.userRepository.findUserById(id);
    if (!exitsUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    if (payload.email) {
      const exitsUserWithEmail = await this.userRepository.findUserByEmail(
        payload.email,
      );
      if (exitsUserWithEmail) {
        throw new ConflictException('User with email already exists');
      }
    }

    const user = await this.userRepository.updateUser(id, payload);
    return plainToInstance(UserDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async deleteUser(id: string): Promise<UserDto> {
    const user = await this.userRepository.deleteUser(id);
    return plainToInstance(UserDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async findAllUsers(): Promise<UserDto[]> {
    const users = await this.userRepository.findAllUsers();
    return users.map((user) =>
      plainToInstance(UserDto, user, {
        excludeExtraneousValues: true,
      }),
    );
  }

  async findUserById(
    id: string,
    includePasswordField = false,
  ): Promise<UserDto> {
    const user = await this.userRepository.findUserById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return !includePasswordField
      ? plainToInstance(UserDto, user, {
          excludeExtraneousValues: true,
        })
      : user;
  }

  async findUserByEmail(
    email: string,
    includePasswordField = false,
  ): Promise<UserDto> {
    const user = await this.userRepository.findUserByEmail(email);

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return !includePasswordField
      ? plainToInstance(UserDto, user, {
          excludeExtraneousValues: true,
        })
      : user;
  }

  async getAllUserwithPaginated(
    page: number = 1,
    limit: number = 10,
    query?: string,
  ): Promise<{
    users: UserDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const result = await this.userRepository.getAllUserwithPaginated(
      page,
      limit,
      query,
    );

    const users = result.users.map((user) =>
      plainToInstance(UserDto, user, {
        excludeExtraneousValues: true,
      }),
    );

    return {
      ...result,
      users,
    };
  }
}
