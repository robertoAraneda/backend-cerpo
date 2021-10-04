import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { SystemModule } from '../src/system/system.module';
import { Connection } from 'typeorm';
import { AppModule } from '../src/app.module';
import { AuthLoginDto } from '../src/auth/dto/auth-login.dto';
import { AuthModule } from '../src/auth/auth.module';
import { CreateSystemDto } from '../src/system/dto/create-system.dto';
import { Role } from '../src/auth/role.enum';
import { UserService } from '../src/user/services/user.service';
import { System } from '../src/system/entities/system.entity';
import { UpdateSystemDto } from '../src/system/dto/update-system.dto';
import { SystemService } from '../src/system/services/system.service';
import { CreateSystemStub } from '../src/system/stubs/create-system.stub';

describe('SystemController (e2e)', () => {
  let app: INestApplication;
  let authToken;
  let service: SystemService;
  let userService: UserService;
  let connection: Connection;
  const BASE_URL = '/systems';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, AuthModule, SystemModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    service = moduleFixture.get<SystemService>(SystemService);
    userService = moduleFixture.get<UserService>(UserService);
    connection = app.get(Connection);

    await connection.synchronize(true);

    await userService.createUser({
      rut: '15654738-7',
      given: 'ROBERTO ALEJANDRO',
      fatherFamily: 'ARANEDA',
      motherFamily: 'ESPINOZA',
      email: 'robaraneda@gmail.com',
      password: 'admin',
      role: Role.ADMIN,
    });

    await service.createSystem({
      name: 'System name 1',
    });

    await app.init();
  });

  it('return an authorization token', async () => {
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

  it('/system (POST)', async () => {
    const system: CreateSystemDto = CreateSystemStub;

    const response = await request(app.getHttpServer())
      .post(`${BASE_URL}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(system)
      .expect(HttpStatus.CREATED);

    expect(response.body.name).toBe(system.name);
  });

  it('/system (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`${BASE_URL}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.OK);

    const resources = response.body;

    const systems = await service.getSystems({});

    expect(resources).toHaveLength(systems.length);
  });

  it('/system/:id (GET)', async () => {
    const systems = await service.getSystems({});

    const system: System = systems[0];

    const response = await request(app.getHttpServer())
      .get(`${BASE_URL}/${system.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.OK);

    const resource: System = response.body;

    expect(resource.id).toBe(system.id);
  });

  it('/system/:id (PATCH)', async () => {
    const systems = await service.getSystems({});

    const system: System = systems[0];

    const updatedSystemDto: UpdateSystemDto = {
      name: 'new name system',
    };

    const response = await request(app.getHttpServer())
      .patch(`${BASE_URL}/${system.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedSystemDto)
      .expect(HttpStatus.OK);

    const resource: System = response.body;

    expect(resource.id).toBe(system.id);
    expect(resource.name).toBe(updatedSystemDto.name);
  });

  it('/system/:id (DELETE)', async () => {
    const systems = await service.getSystems({});

    const system: System = systems[0];

    const response = await request(app.getHttpServer())
      .delete(`${BASE_URL}/${system.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.OK);

    const resource: System = response.body;

    expect(resource).toStrictEqual({});
  });

  it("It should throw a NotFoundException if system doesn't exist", async () => {
    const unknownUuid = 999;

    const response = await request(app.getHttpServer())
      .get(`${BASE_URL}/${unknownUuid}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.NOT_FOUND);

    const resource: System = response.body;

    const errorResponseExample = {
      statusCode: 404,
      message: `System with ID "${unknownUuid}" not found`,
      error: 'Not Found',
    };

    expect(errorResponseExample).toStrictEqual(resource);
  });

  it('It should throw a BadRequestException if the required parameters were not sent', async () => {
    //El nombre de la organización no es enviado en el request
    const system = {
      telecom: 'Telecom for system 1',
    };
    const response = await request(app.getHttpServer())
      .post(`${BASE_URL}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(system)
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body.error).toBe('Bad Request');
  });

  afterAll(async () => {
    //await connection.synchronize(true);
    await app.close();
  });
});
