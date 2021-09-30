import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
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
@UseGuards(JwtAuthGuard)
export class UsersController {
  private logger = new Logger('UserController');
  constructor(private readonly userService: UsersService) {}

  @Get()
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  getUsers(
    @GetUser() user: UserAuthInterface,
    @Query() filterDto: GetUsersFilterDto,
  ): Promise<User[]> {
    this.logger.verbose(`User "${user.given}" retrieving all users`);
    return this.userService.getUsers(filterDto);
  }

  @Get(':uuid')
  getUserById(@Param('uuid', new ParseUUIDPipe()) uuid: string): Promise<User> {
    return this.userService.getUserById(uuid);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  @Delete(':uuid')
  deleteUser(@Param('uuid', new ParseUUIDPipe()) uuid: string): Promise<void> {
    return this.userService.deleteUser(uuid);
  }

  @Patch(':uuid')
  @UsePipes(ValidationPipe)
  updateUser(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @Body() updatedUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUser(uuid, updatedUserDto);
  }
}
