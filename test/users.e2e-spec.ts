import { HttpStatus, INestApplication } from '@nestjs/common';
import { UsersService } from '../src/users/services/users.service';
import { Connection } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { AuthModule } from '../src/auth/auth.module';
import { Role } from '../src/auth/role.enum';
import { AuthLoginDto } from '../src/auth/dto/auth-login.dto';
import * as request from 'supertest';
import { User } from '../src/users/entities/user.entity';
import { UpdateUserDto } from '../src/users/dto/update-user.dto';
import { UsersModule } from '../src/users/users.module';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { UserStub } from '../src/users/stubs/user.stub';
import { GetUsersFilterDto } from '../src/users/dto/get-users-filter.dto';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let authToken;
  let service: UsersService;
  let connection: Connection;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, AuthModule, UsersModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    service = moduleFixture.get<UsersService>(UsersService);
    connection = app.get(Connection);

    await connection.synchronize(true);

    //const users = await service.getUsers({});
    await service.createUser({
      rut: '10669322-6',
      given: 'ROBERTO ALEJANDRO',
      fatherFamily: 'ARANEDA',
      motherFamily: 'ESPINOZA',
      email: 'robaraneda@yahoo.es',
      password: 'admin',
      role: Role.ADMIN,
    });

    await app.init();
  });

  it('return an authorization token', async () => {
    const authInfo: AuthLoginDto = { rut: '10669322-6', password: 'admin' };
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

  it('/users (POST)', async () => {
    const user: CreateUserDto = {
      rut: '15549763-7',
      given: 'CLAUDIA ANDREA',
      fatherFamily: 'CONTRERAS',
      motherFamily: 'MELLADO',
      email: 'kuyenko@yahoo.es',
      role: Role.ADMIN,
      password: 'admin',
    };

    const response = await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${authToken}`)
      .send(user)
      .expect(HttpStatus.CREATED);

    expect(response.body.rut).toBe(user.rut);
    expect(response.body.given).toBe(user.given);
    expect(response.body.fatherFamily).toBe(user.fatherFamily);
    expect(response.body.motherFamily).toBe(user.motherFamily);
  });

  it('/users (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.OK);

    const resources = response.body;

    const users = await service.getUsers({});

    expect(resources).toHaveLength(users.length);
  });

  it('/users/:id (GET)', async () => {
    const users = await service.getUsers({});

    const user: User = users[0];

    const response = await request(app.getHttpServer())
      .get(`/users/${user.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.OK);

    const resource: User = response.body;

    expect(resource.id).toBe(user.id);
  });

  it('/users (GET) with parameters', async () => {
    const users = await service.getUsers({});

    const user: User = users[0];

    //buscar un usuario por los parámetros de búsqueda
    const filterUser: GetUsersFilterDto = {
      given: user.given,
      fatherFamily: user.fatherFamily,
      motherFamily: user.motherFamily,
      rut: user.rut,
      email: user.email,
    };

    const response = await request(app.getHttpServer())
      .get(`/users`)
      .query(filterUser)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.OK);

    const resource: User = response.body.filter(
      (resource) => resource.id === user.id,
    )[0];

    expect(user.id).toBe(resource.id);
  });

  it('/user/:id (PATCH)', async () => {
    const users = await service.getUsers({});

    const user: User = users[0];

    const updatedUserDto: UpdateUserDto = {
      rut: '16317005-1',
      email: 'roberto.araneda@minsal.cl',
    };

    const response = await request(app.getHttpServer())
      .patch(`/users/${user.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedUserDto)
      .expect(HttpStatus.OK);

    const resource: User = response.body;

    expect(resource.id).toBe(user.id);
    expect(resource.email).toBe(updatedUserDto.email);
    expect(resource.rut).toBe(updatedUserDto.rut);
  });

  it('/user/:id (DELETE)', async () => {
    const users = await service.getUsers({});

    const user: User = users[0];

    const response = await request(app.getHttpServer())
      .delete(`/users/${user.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.OK);

    const resource: User = response.body;

    expect(resource).toStrictEqual({});
  });

  it("It should throw a NotFoundException if user doesn't exist", async () => {
    const unknownUuid = '123e4567-e89b-12d3-a456-426614174000';

    const response = await request(app.getHttpServer())
      .get(`/users/${unknownUuid}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.NOT_FOUND);

    const resource: User = response.body;

    const errorResponseExample = {
      statusCode: 404,
      message: `User with ID "${unknownUuid}" not found`,
      error: 'Not Found',
    };

    expect(errorResponseExample).toStrictEqual(resource);
  });

  it('It should throw a ConflictException if user will updated with an existing email', async () => {
    const users = await service.getUsers({});

    const createUserDto: CreateUserDto = UserStub;

    await service.createUser(createUserDto);

    const user: User = users[0];

    const updatedUserDto: UpdateUserDto = {
      email: createUserDto.email,
    };

    const response = await request(app.getHttpServer())
      .patch(`/users/${user.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedUserDto)
      .expect(HttpStatus.CONFLICT);

    const resource: User = response.body;

    const errorResponseExample = {
      statusCode: 409,
      message: `User with this email "${createUserDto.email}" already exists.`,
      error: 'Conflict',
    };

    expect(errorResponseExample).toStrictEqual(resource);
  });

  it('It should throw a ConflictException if user will updated with an existing rut', async () => {
    const users = await service.getUsers({});

    const createUserDto: CreateUserDto = {
      given: 'Claudia',
      fatherFamily: 'Alarcón',
      motherFamily: 'Lazo',
      rut: '22222222-1',
      email: 'c.alarconlazo@email.com',
      role: Role.ADMIN,
      password: 'admin',
    };

    await service.createUser(createUserDto);

    const user: User = users[0];

    const updatedUserDto: UpdateUserDto = {
      rut: createUserDto.rut,
    };

    const response = await request(app.getHttpServer())
      .patch(`/users/${user.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedUserDto)
      .expect(HttpStatus.CONFLICT);

    const resource: User = response.body;

    const errorResponseExample = {
      statusCode: 409,
      message: `User with this rut "${createUserDto.rut}" already exists.`,
      error: 'Conflict',
    };

    expect(errorResponseExample).toStrictEqual(resource);
  });

  it('It should throw a BadRequestException if the required parameters were not sent', async () => {
    //El rut del paciente no es enviado en el request
    const user = {
      address: 'JUAN ENRIQUE RODO 05080',
      birthdate: '1984-06-25',
      mobile: '+56988558845',
      phone: '45-2559023',
      given: 'CLAUDIA ANDREA',
      fatherFamily: 'CONTRERAS',
      motherFamily: 'MELLADO',
      email: 'kuyenko@yahoo.es',
    };
    const response = await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${authToken}`)
      .send(user)
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body.error).toBe('Bad Request');
  });

  afterAll(async () => {
    //await connection.synchronize(true);
    await app.close();
  });
});
