import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from '../user/repositories/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import * as config from 'config';
import { JwtStrategy } from './jwt.strategy';
import { User } from '../user/entities/user.entity';
import { Role } from './role.enum';
const jwtConfig = config.get('jwt');

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule,
        JwtModule.register({
          secret: jwtConfig.secret,
          signOptions: { expiresIn: jwtConfig.expiresIn },
        }),
      ],
      controllers: [AuthController],
      providers: [AuthService, UserRepository, JwtStrategy],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be login and get jwt token', async () => {
    const user: User = {
      id: 1,
      given: 'Roberto',
      fatherFamily: 'Araneda',
      motherFamily: 'Espinoza',
      rut: '15654738-7',
      email: 'robaraneda@gmail.com',
      password: '$2b$10$PwMq.ZNhL8W1zp5f6Cqp2eg/tWknnZPV6yt81L.nr7tC/QrV1KJmW',
      createdAt: '2021-09-20T22:13:55.971Z',
      updatedAt: '2021-09-21T19:00:05.280Z',
      deletedAt: null,
      salt: null,
      role: Role.ADMIN,
    };

    jest.spyOn(service, 'validateUser');
    jest.spyOn(controller, 'login');
    jest.spyOn(userRepository, 'findOne').mockImplementation(async () => user);

    const { access_token } = await controller.login({
      rut: '15654738-7',
      password: 'admin',
    });

    expect(access_token).toMatch(
      /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
    );
    expect(service.validateUser).toHaveBeenCalled();
    expect(controller.login).toHaveBeenCalled();
    expect(userRepository.findOne).toHaveBeenCalled();
  });

  it('should return a protected route /me', async () => {
    const user: User = {
      id: 1,
      given: 'Roberto',
      fatherFamily: 'Araneda',
      motherFamily: 'Espinoza',
      rut: '15654738-7',
      email: 'robaraneda@gmail.com',
      password: '$2b$10$PwMq.ZNhL8W1zp5f6Cqp2eg/tWknnZPV6yt81L.nr7tC/QrV1KJmW',
      createdAt: '2021-09-20T22:13:55.971Z',
      updatedAt: '2021-09-21T19:00:05.280Z',
      deletedAt: null,
      salt: null,
      role: Role.ADMIN,
    };

    jest.spyOn(service, 'validateUser');
    jest.spyOn(controller, 'me').mockImplementation(async () => user);
    jest.spyOn(userRepository, 'findOne').mockImplementation(async () => user);

    const userResponse = await controller.me({});

    expect(controller.me).toHaveBeenCalled();

    expect(userResponse.given).toBe(user.given);
    expect(userResponse.fatherFamily).toBe(user.fatherFamily);
    expect(userResponse.motherFamily).toBe(user.motherFamily);
  });
});
