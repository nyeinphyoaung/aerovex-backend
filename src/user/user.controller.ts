import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dtos/user.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  CurrentUser,
  type JwtUser,
} from 'src/auth/decorators/current-user.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({
    status: 200,
    description: 'Current user fetched successfully',
    type: UserDto,
  })
  async getCurrentUser(@CurrentUser() user: JwtUser): Promise<UserDto> {
    return this.userService.findUserByEmail(user.email);
  }
}
