import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersRepository } from '../users/repositories/users.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import * as config from 'config';
import { JwtStrategy } from './jwt.strategy';
import { AuthLoginDto } from './dto/auth-login.dto';
import { User } from '../users/entities/user.entity';
import { Role } from './role.enum';

const jwtConfig = config.get('jwt');

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule,
        JwtModule.register({
          secret: jwtConfig.secret,
          signOptions: { expiresIn: jwtConfig.expiresIn },
        }),
      ],
      providers: [AuthService, JwtStrategy, UsersRepository],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<UsersRepository>(UsersRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a user object when credentials are valid', async () => {
    const user: User = {
      id: '8c26266f-3fe9-4b5b-bd88-bc2754415c12',
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

    jest.spyOn(userRepository, 'findOne').mockImplementation(async () => user);

    const userAuth: AuthLoginDto = { rut: '15654738-7', password: 'admin' };
    const { access_token } = await service.validateUser(userAuth);

    expect(access_token).toMatch(
      /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
    );
  });
});
