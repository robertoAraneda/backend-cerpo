import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { GetUsersFilterDto } from '../dto/get-users-filter.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/role.enum';
import { UserAuthInterface } from '../../auth/interfaces/user-auth.interface';

@Controller('users')
@Roles(Role.ADMIN)
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
export class UserController {
  private logger = new Logger('UserController');
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers(
    @GetUser() user: UserAuthInterface,
    @Query() filterDto: GetUsersFilterDto,
  ): Promise<User[]> {
    this.logger.verbose(`User "${user.given}" retrieving all users`);
    return this.userService.getUsers(filterDto);
  }

  @Get(':id')
  getUserById(@Param('id') id: number): Promise<User> {
    return this.userService.getUserById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: number): Promise<void> {
    return this.userService.deleteUser(id);
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  updateUser(
    @Param('id') id: number,
    @Body() updatedUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUser(id, updatedUserDto);
  }
}
