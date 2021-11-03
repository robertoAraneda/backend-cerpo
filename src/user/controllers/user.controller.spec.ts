import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';
import { UserRepository } from '../repositories/user.repository';
import { UserAuthInterface } from '../../auth/interfaces/user-auth.interface';
import { UsersStub } from '../stubs/users.stub';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserStub } from '../stubs/user.stub';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ApiPersonaService } from '../../api-persona/services/api-persona.service';
import { ConfigService } from '@nestjs/config';
import { CacheService } from '../../cache/services/cache.service';
import { CacheRepository } from '../../cache/repositories/cache.repository';

describe('UsersController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        UserRepository,
        ApiPersonaService,
        ConfigService,
        CacheService,
        CacheRepository,
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should controller be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should service be defined', () => {
    expect(service).toBeDefined();
  });

  describe('GetUsers', () => {
    it('should return and array of Users', async () => {
      const result: User[] = UsersStub.getAll();

      jest.spyOn(service, 'getUsers').mockImplementation(async () => result);

      const user: UserAuthInterface = {
        id: '15654738-7',
        given: 'ROBERTO ALEJANDRO',
        fatherFamily: 'ARANEDA',
        motherFamily: 'ESPINOZA',
        role: 'admin',
      };
      const filterDto = {};

      expect(await controller.getUsers(user, filterDto)).toBe(result);
      expect(service.getUsers).toHaveBeenCalled();
    });
  });

  describe('CreateUser', () => {
    it('should create one user', async () => {
      const user: CreateUserDto = UserStub;

      const result: User = UsersStub.getOne();

      jest.spyOn(service, 'createUser').mockImplementation(async () => result);

      expect(await controller.createUser(user)).toBe(result);
      expect(service.createUser).toHaveBeenCalled();
    });
  });

  describe('updateUser', () => {
    it('should update one user', async () => {
      const result: User = UsersStub.getOne();

      const updatedata: UpdateUserDto = {
        given: 'NAME CHANGED',
      };

      jest.spyOn(service, 'updateUser').mockImplementation(async () => result);

      expect(await controller.updateUser(result.id, updatedata)).toBe(result);
      expect(service.updateUser).toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    it('should delete one user', async () => {
      const user: User = UsersStub.getOne();

      const result: void = undefined;

      jest.spyOn(service, 'deleteUser').mockImplementation(async () => result);

      expect(await controller.deleteUser(user.id));
      expect(service.deleteUser).toHaveBeenCalled();
    });
  });
});
