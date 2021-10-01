import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { StatusCasesModule } from '../src/status-cases/status-cases.module';
import { Connection } from 'typeorm';
import { AppModule } from '../src/app.module';
import { AuthLoginDto } from '../src/auth/dto/auth-login.dto';
import { AuthModule } from '../src/auth/auth.module';
import { CreateStatusCaseDto } from '../src/status-cases/dto/create-status-case.dto';
import { Role } from '../src/auth/role.enum';
import { UsersService } from '../src/users/services/users.service';
import { StatusCase } from '../src/status-cases/entities/status-case.entity';
import { UpdateStatusCaseDto } from '../src/status-cases/dto/update-status-case.dto';
import { StatusCasesService } from '../src/status-cases/services/status-cases.service';
import { CreateStatusCaseStub } from '../src/status-cases/stubs/create-status-case.stub';

describe('StatusCasesController (e2e)', () => {
  let app: INestApplication;
  let authToken;
  let service: StatusCasesService;
  let userService: UsersService;
  let connection: Connection;
  const BASE_URL = '/status-cases';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, AuthModule, StatusCasesModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    service = moduleFixture.get<StatusCasesService>(StatusCasesService);
    userService = moduleFixture.get<UsersService>(UsersService);
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

    await service.createStatusCase({
      name: 'StatusCase name 1',
      description: 'Description status case 1',
      color: 'color 1',
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

  it('/statusCases (POST)', async () => {
    const statusCase: CreateStatusCaseDto = CreateStatusCaseStub;

    const response = await request(app.getHttpServer())
      .post(`${BASE_URL}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(statusCase)
      .expect(HttpStatus.CREATED);

    expect(response.body.name).toBe(statusCase.name);
  });

  it('/statusCases (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`${BASE_URL}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.OK);

    const resources = response.body;

    const statusCases = await service.getStatusCases({});

    expect(resources).toHaveLength(statusCases.length);
  });

  it('/statusCase/:id (GET)', async () => {
    const statusCases = await service.getStatusCases({});

    const statusCase: StatusCase = statusCases[0];

    const response = await request(app.getHttpServer())
      .get(`${BASE_URL}/${statusCase.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.OK);

    const resource: StatusCase = response.body;

    expect(resource.id).toBe(statusCase.id);
  });

  it('/statusCase/:id (PATCH)', async () => {
    const statusCases = await service.getStatusCases({});

    const statusCase: StatusCase = statusCases[0];

    const updatedStatusCaseDto: UpdateStatusCaseDto = {
      name: 'new name statusCase',
    };

    const response = await request(app.getHttpServer())
      .patch(`${BASE_URL}/${statusCase.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedStatusCaseDto)
      .expect(HttpStatus.OK);

    const resource: StatusCase = response.body;

    expect(resource.id).toBe(statusCase.id);
    expect(resource.name).toBe(updatedStatusCaseDto.name);
  });

  it('/statusCase/:id (DELETE)', async () => {
    const statusCases = await service.getStatusCases({});

    const statusCase: StatusCase = statusCases[0];

    const response = await request(app.getHttpServer())
      .delete(`${BASE_URL}/${statusCase.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.OK);

    const resource: StatusCase = response.body;

    expect(resource).toStrictEqual({});
  });

  it("It should throw a NotFoundException if statusCase doesn't exist", async () => {
    const unknownUuid = '123e4567-e89b-12d3-a456-426614174000';

    const response = await request(app.getHttpServer())
      .get(`${BASE_URL}/${unknownUuid}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.NOT_FOUND);

    const resource: StatusCase = response.body;

    const errorResponseExample = {
      statusCode: 404,
      message: `StatusCase with ID "${unknownUuid}" not found`,
      error: 'Not Found',
    };

    expect(errorResponseExample).toStrictEqual(resource);
  });

  it('It should throw a BadRequestException if the required parameters were not sent', async () => {
    //El nombre de la organización no es enviado en el request
    const statusCase = {
      telecom: 'Telecom for statusCase 1',
    };
    const response = await request(app.getHttpServer())
      .post(`${BASE_URL}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(statusCase)
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body.error).toBe('Bad Request');
  });

  afterAll(async () => {
    //await connection.synchronize(true);
    await app.close();
  });
});
