import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from '../repositories/users.repository';
import { User } from '../entities/user.entity';
import { UsersStub } from '../stubs/users.stub';
import { GetUsersFilterDto } from '../dto/get-users-filter.dto';
import { UserStub } from '../stubs/user.stub';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, UsersRepository],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UsersRepository>(UsersRepository);
  });

  it('should service to be defined', () => {
    expect(service).toBeDefined();
  });

  it('should repository to be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('GetUsers', () => {
    it('should return and array of Users', async () => {
      const result: User[] = UsersStub.getAll();

      jest.spyOn(repository, 'getUsers').mockImplementation(async () => result);

      const filterDto: GetUsersFilterDto = {};

      expect(await service.getUsers(filterDto)).toBe(result);
      expect(repository.getUsers).toHaveBeenCalled();
    });
  });

  describe('GetUser', () => {
    it('should return an user by ID', async () => {
      const user: User = UsersStub.getOne();

      jest.spyOn(repository, 'findOne').mockImplementation(async () => user);

      expect(await service.getUserById(user.id)).toBe(user);
      expect(repository.findOne).toHaveBeenCalled();
    });

    it('should throw an NotFoundException when user not found by ID', async () => {
      const user: User = UsersStub.getOne();

      jest
        .spyOn(repository, 'findOne')
        .mockImplementation(async () => undefined);

      try {
        await service.getUserById('wrong id');
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }

      expect(repository.findOne).toHaveBeenCalled();
    });

    it('should return an user by params', async () => {
      const user: User = UsersStub.getOne();

      jest.spyOn(repository, 'findOne').mockImplementation(async () => user);

      const foundUser = await service.getUser({ where: { rut: '15654738-7' } });

      expect(foundUser).toBe(user);
      expect(repository.findOne).toHaveBeenCalled();
    });

    it('should throw an NotFoundException when user not found by params', async () => {
      const user: User = UsersStub.getOne();

      jest
        .spyOn(repository, 'findOne')
        .mockImplementation(async () => undefined);

      try {
        await service.getUser({ where: { rut: 'wrong rut' } });
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }

      expect(repository.findOne).toHaveBeenCalled();
    });
  });

  describe('CreateUser', () => {
    it('should create one user', async () => {
      const createUserDto: CreateUserDto = UserStub;
      const result: User = UsersStub.getOne();

      jest
        .spyOn(repository, 'createUser')
        .mockImplementation(async () => result);

      expect(await service.createUser(createUserDto)).toBe(result);
      expect(repository.createUser).toHaveBeenCalled();
    });
  });

  describe('UpdateUser', () => {
    it('should update one user', async () => {
      const user: User = UsersStub.getOne();

      const updateUserDto: UpdateUserDto = {
        email: 'robaraneda@gmail.com',
      };

      jest.spyOn(repository, 'updateUser').mockImplementation(async () => user);

      expect(await service.updateUser(user.id, updateUserDto)).toBe(user);
      expect(repository.updateUser).toHaveBeenCalled();
    });
  });

  describe('DeleteUser', () => {
    it('should delete one user', async () => {
      const user: User = UsersStub.getOne();

      jest
        .spyOn(repository, 'softRemove')
        .mockImplementation(async () => undefined);

      jest.spyOn(service, 'getUserById').mockImplementation(async () => user);

      expect(await service.deleteUser(user.id)).toBe(undefined);
      expect(repository.softRemove).toHaveBeenCalledTimes(1);
      expect(service.getUserById).toHaveBeenCalledTimes(1);
    });
  });
});
