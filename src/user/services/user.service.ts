import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { GetUsersFilterDto } from '../dto/get-users-filter.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async getUserById(id: number): Promise<User> {
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

  async deleteUser(id: number): Promise<void> {
    const user = await this.getUserById(id);
    await this.userRepository.softRemove<User>(user);
  }

  async getUsers(filterDto: GetUsersFilterDto): Promise<User[]> {
    return await this.userRepository.getUsers(filterDto);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userRepository.updateUser(id, updateUserDto);
  }
}
