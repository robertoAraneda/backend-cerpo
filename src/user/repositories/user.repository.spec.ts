import { Connection } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { createMemDB } from '../../config/create-memory-database';
import { ConflictException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { GetUsersFilterDto } from '../dto/get-users-filter.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Role } from '../../auth/role.enum';
import CreateUserStub from '../stubs/create-user.stub';

describe('UsersRepository', () => {
  let repository: UserRepository;
  let db: Connection;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [],
    }).compile();
    db = await createMemDB();
    repository = db.getCustomRepository<UserRepository>(UserRepository);

    for (let i = 0; i < 3; i++) {
      const userDto: CreateUserDto = CreateUserStub(i);
      await repository.createUser(userDto);
    }
  });

  afterEach(() => db.close());

  it('should repository be defined', () => {
    expect(repository).toBeDefined();
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

  it('should create one user', async () => {
    jest.spyOn(repository, 'createUser');

    const createUserDto: CreateUserDto = CreateUserStub('F');

    const user: User = await repository.createUser(createUserDto);

    expect(repository.createUser).toBeCalledTimes(1);
    expect(user.constructor.name).toBe('User');
    expect(user.given).toBe(createUserDto.given);
  });

  it('should throw an error if user will be created with an existing rut', async () => {
    jest.spyOn(repository, 'createUser');

    const createUserDto: CreateUserDto = CreateUserStub('C');

    await repository.createUser(createUserDto);

    createUserDto.email = 'new@gmail.com';

    try {
      await repository.createUser(createUserDto);
    } catch (e) {
      expect(e).toBeInstanceOf(ConflictException);
    }
  });

  it('should throw an error if user will be created with an existing email', async () => {
    jest.spyOn(repository, 'createUser');

    const createUserDto: CreateUserDto = CreateUserStub('K');

    await repository.createUser(createUserDto);

    //modificamos el rut, para sólo dejar el mismo email y modelar la prueba
    createUserDto.rut = '10669312-6';

    try {
      await repository.createUser(createUserDto);
    } catch (e) {
      expect(e).toBeInstanceOf(ConflictException);
    }
  });

  it('should updated one user', async () => {
    jest.spyOn(repository, 'updateUser');

    const createUserDto: CreateUserDto = CreateUserStub('B');

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

  it('should throw a ConflictException if one user used an existing rut when is updating', async () => {
    jest.spyOn(repository, 'updateUser');

    const createUserDto: CreateUserDto = CreateUserStub('G');

    const createAnotherUserDto: CreateUserDto = {
      rut: '55555555-7',
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
      rut: '55555555-7',
    };

    try {
      await repository.updateUser(user.id, updateUserDto);
    } catch (e) {
      expect(e).toBeInstanceOf(ConflictException);
    }
  });

  it('should throw a ConflictException if one user used an existing email when is updating', async () => {
    jest.spyOn(repository, 'updateUser');

    const createUserDto: CreateUserDto = CreateUserStub('H');

    const createAnotherUserDto: CreateUserDto = {
      rut: '6666666-6',
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

    try {
      await repository.updateUser(user.id, updateUserDto);
    } catch (e) {
      expect(e).toBeInstanceOf(ConflictException);
    }
  });

  it('should delete one user', async () => {
    jest.spyOn(repository, 'softRemove');

    const createUserDto: CreateUserDto = CreateUserStub('A');

    const user: User = await repository.createUser(createUserDto);

    await repository.softRemove(user);

    const getDeletedUser: User = await repository.findOne({
      where: { id: user.id },
      withDeleted: true,
    });

    expect(repository.softRemove).toBeCalledTimes(1);
    expect(getDeletedUser.deletedAt).not.toBe(null);
  });
});
