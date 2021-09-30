import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { GetUsersFilterDto } from '../dto/get-users-filter.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private readonly userRepository: UsersRepository,
  ) {}

  async getUserById(id: string): Promise<User> {
    const found = await this.userRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return found;
  }

  async getUser(options: any): Promise<User> {
    const found = await this.userRepository.findOne(options);

    if (!found) {
      throw new NotFoundException(`User with ID "${options}" not found`);
    }
    return found;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return await this.userRepository.createUser(createUserDto);
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.getUserById(id);
    await this.userRepository.softRemove<User>(user);
  }

  async getUsers(filterDto: GetUsersFilterDto): Promise<User[]> {
    return await this.userRepository.getUsers(filterDto);
  }

  async updateUser(uuid: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userRepository.updateUser(uuid, updateUserDto);
  }
}
