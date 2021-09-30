import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/services/users.service';
import { Connection } from 'typeorm';
import { AuthModule } from '../src/auth/auth.module';
import { AuthLoginDto } from '../src/auth/dto/auth-login.dto';
import { Role } from '../src/auth/role.enum';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let authToken;
  let service: UsersService;
  let connection: Connection;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    service = moduleFixture.get<UsersService>(UsersService);
    connection = app.get(Connection);
    await connection.synchronize(true);

    await service.createUser({
      rut: '15654738-7',
      given: 'ROBERTO ALEJANDRO',
      fatherFamily: 'ARANEDA',
      motherFamily: 'ESPINOZA',
      email: 'robaraneda@gmail.com',
      password: 'admin',
      role: Role.ADMIN,
    });

    await app.init();
  });

  it('should detect that we are not logged in', () => {
    return request(app.getHttpServer())
      .get('/auth/me')
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('disallow invalid credentials', async () => {
    const authInfo: AuthLoginDto = { rut: '15654738-7', password: 'badpass' };
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(authInfo);
    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('return an authorization token for valid credentials', async () => {
    const authInfo: AuthLoginDto = { rut: '15654738-7', password: 'admin' };
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(authInfo);
    expect(response.status).toBe(HttpStatus.CREATED);
    expect(response.body.access_token).not.toBe(undefined);
    expect(response.body.access_token).toMatch(
      /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
    );
    authToken = response.body.access_token;
  });

  it('should show that we are logged in', () => {
    return request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.OK);
  });

  it('should get a JWT then successfully make a call', async () => {
    const authInfo: AuthLoginDto = { rut: '15654738-7', password: 'admin' };

    const loginReq = await request(app.getHttpServer())
      .post('/auth/login')
      .send(authInfo)
      .expect(HttpStatus.CREATED);

    const token = loginReq.body.access_token;
    const response = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', 'Bearer ' + token);

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.given).toBe('ROBERTO ALEJANDRO');
    expect(response.body.fatherFamily).toBe('ARANEDA');
    expect(response.body.motherFamily).toBe('ESPINOZA');
    expect(response.body.role).toBe(Role.ADMIN);
  });

  afterAll(async () => {
    // await connection.synchronize(true);
    await app.close();
  });
});
