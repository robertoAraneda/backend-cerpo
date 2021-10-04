import { Connection } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { createMemDB } from '../../config/create-memory-database';
import { ConflictException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UsersStub } from '../stubs/users.stub';
import { GetUsersFilterDto } from '../dto/get-users-filter.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserStub } from '../stubs/user.stub';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Role } from '../../auth/role.enum';

describe('UsersRepository', () => {
  let repository: UserRepository;
  let db: Connection;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [],
    }).compile();
    db = await createMemDB([User]);
    repository = db.getCustomRepository<UserRepository>(UserRepository);
  });

  afterEach(() => db.close());

  it('should repository be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('GetUsers', () => {
    beforeEach(async () => {
      await Promise.all(
        UsersStub.getAll().map(async (user) => {
          await repository.createUser(user);
        }),
      );
    });

    it('should return and array of Users', async () => {
      jest.spyOn(repository, 'getUsers');

      const filterDto = {};

      const users = await repository.find();

      expect(await repository.getUsers(filterDto)).toStrictEqual(users);
    });

    it('should return and array of filtered Users', async () => {
      jest.spyOn(repository, 'getUsers');

      const users = await repository.find();

      const filterDto: GetUsersFilterDto = {
        rut: '15654738-7',
        given: 'Roberto',
        fatherFamily: 'Araneda',
        motherFamily: 'Espinoza',
        email: 'robaraneda@gmail.com',
      };

      expect(await repository.getUsers(filterDto)).toStrictEqual(
        [...users].filter((user) => user.given.includes(filterDto.given)),
      );
    });
  });

  describe('createUser', () => {
    it('should create one user', async () => {
      jest.spyOn(repository, 'createUser');

      const createUserDto: CreateUserDto = UserStub;

      const user: User = await repository.createUser(createUserDto);

      expect(repository.createUser).toBeCalledTimes(1);
      expect(user.constructor.name).toBe('User');
      expect(await repository.count()).toBe(1);
    });

    it('should throw an error if user will be created with an existing rut', async () => {
      jest.spyOn(repository, 'createUser');

      const createUserDto: CreateUserDto = UserStub;

      await repository.createUser(createUserDto);

      jest.spyOn(repository, 'validateUniqueConstraint');

      try {
        await repository.createUser(createUserDto);
      } catch (e) {
        expect(e).toBeInstanceOf(ConflictException);
      }
      expect(repository.validateUniqueConstraint).toHaveBeenCalled();
    });

    it('should throw an error if user will be created with an existing email', async () => {
      jest.spyOn(repository, 'createUser');

      const createUserDto: CreateUserDto = UserStub;

      //modificamos el rut, para sólo dejar el mismo email y modelar la prueba
      createUserDto.rut = '10669322-6';

      await repository.createUser(createUserDto);

      jest.spyOn(repository, 'validateUniqueConstraint');

      try {
        await repository.createUser(createUserDto);
      } catch (e) {
        expect(e).toBeInstanceOf(ConflictException);
      }
      expect(repository.validateUniqueConstraint).toHaveBeenCalled();
    });
  });

  describe('updateUser', () => {
    it('should updated one user', async () => {
      jest.spyOn(repository, 'updateUser');

      const createUserDto: CreateUserDto = UserStub;

      const user: User = await repository.createUser(createUserDto);

      const updateUserDto: UpdateUserDto = {
        email: 'roberto.araneda@minsal.cl',
      };

      const updatedUser: User = await repository.updateUser(
        user.id,
        updateUserDto,
      );

      expect(repository.updateUser).toBeCalledTimes(1);
      expect(updatedUser.constructor.name).toBe('User');
      expect(updatedUser.email).toBe(updateUserDto.email);
    });

    it('should thown an ConflictException if one user used an existing rut when is updating', async () => {
      jest.spyOn(repository, 'updateUser');

      const createUserDto: CreateUserDto = UserStub;

      const createAnotherUserDto: CreateUserDto = {
        rut: '15549763-7',
        given: 'ROBERTO ALEJANDRO',
        fatherFamily: 'ARANEDA',
        motherFamily: 'ESPINOZA',
        email: 'kuyenko@gmail.com',
        password: 'admin',
        role: Role.ADMIN,
      };

      const user: User = await repository.createUser(createUserDto);
      await repository.createUser(createAnotherUserDto);

      const updateUserDto: UpdateUserDto = {
        rut: '15549763-7',
      };

      jest.spyOn(repository, 'validateUniqueConstraint');

      try {
        await repository.updateUser(user.id, updateUserDto);
      } catch (e) {
        expect(e).toBeInstanceOf(ConflictException);
      }
      expect(repository.validateUniqueConstraint).toHaveBeenCalled();
    });

    it('should thown an ConflictException if one user used an existing email when is updating', async () => {
      jest.spyOn(repository, 'updateUser');

      const createUserDto: CreateUserDto = UserStub;

      const createAnotherUserDto: CreateUserDto = {
        rut: '15549763-7',
        given: 'ROBERTO ALEJANDRO',
        fatherFamily: 'ARANEDA',
        motherFamily: 'ESPINOZA',
        email: 'kuyenko@gmail.com',
        password: 'admin',
        role: Role.ADMIN,
      };

      const user: User = await repository.createUser(createUserDto);
      await repository.createUser(createAnotherUserDto);

      const updateUserDto: UpdateUserDto = {
        email: 'kuyenko@gmail.com',
      };

      jest.spyOn(repository, 'validateUniqueConstraint');

      try {
        await repository.updateUser(user.id, updateUserDto);
      } catch (e) {
        expect(e).toBeInstanceOf(ConflictException);
      }
      expect(repository.validateUniqueConstraint).toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    it('should delete one user', async () => {
      jest.spyOn(repository, 'softRemove');

      const createUserDto: CreateUserDto = UserStub;

      const user: User = await repository.createUser(createUserDto);

      await repository.softRemove(user);

      const getDeletedUser: User = await repository.findOne({
        where: { id: user.id },
        withDeleted: true,
      });

      expect(repository.softRemove).toBeCalledTimes(1);
      expect(await repository.count()).toBe(0);
      expect(getDeletedUser.deletedAt).not.toBe(null);
    });
  });
});
