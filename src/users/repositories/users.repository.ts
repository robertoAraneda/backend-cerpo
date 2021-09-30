import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { ConflictException } from '@nestjs/common';
import { UpdateUserDto } from '../dto/update-user.dto';
import { GetUsersFilterDto } from '../dto/get-users-filter.dto';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async getUsers(filterDto: GetUsersFilterDto): Promise<User[]> {
    const { rut, email, given, fatherFamily, motherFamily } = filterDto;

    const query = this.createQueryBuilder('user');

    if (rut) {
      query.andWhere('user.rut ILIKE :rut', { rut: `%${rut}%` });
    }

    if (email) {
      query.andWhere('user.email ILIKE :email', { email: `%${email}%` });
    }

    if (given) {
      query.andWhere('user.given ILIKE :given', { given: `%${given}%` });
    }

    if (fatherFamily) {
      query.andWhere('user.father_family ILIKE :fatherFamily', {
        fatherFamily: `%${fatherFamily}%`,
      });
    }

    if (motherFamily) {
      query.andWhere('user.mother_family ILIKE :motherFamily', {
        motherFamily: `%${motherFamily}%`,
      });
    }

    return await query.getMany();
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = new User(createUserDto);

    const salt = await bcrypt.genSalt();

    user.password = await this.hashPassword(createUserDto.password, salt);
    user.salt = salt;

    try {
      return await this.save(user);
    } catch (exception) {
      this.validateUniqueConstraint(exception, createUserDto);
    }
  }

  async updateUser(uuid: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(uuid);

    const salt = await bcrypt.genSalt();

    if (updateUserDto.password) {
      updateUserDto.password = await this.hashPassword(
        updateUserDto.password,
        salt,
      );
    }

    this.merge(user, updateUserDto);

    try {
      return await this.save(user);
    } catch (exception) {
      this.validateUniqueConstraint(exception, updateUserDto);
    }
  }

  validateUniqueConstraint(exception, dto): any {
    if (/(email)[\s\S]+(already exists)/.test(exception.detail)) {
      throw new ConflictException(
        `User with this email "${dto.email}" already exists.`,
      );
    }
    if (/(rut)[\s\S]+(already exists)/.test(exception.detail)) {
      throw new ConflictException(
        `User with this rut "${dto.rut}" already exists.`,
      );
    }
    return exception;
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
