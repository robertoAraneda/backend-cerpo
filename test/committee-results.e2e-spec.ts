import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { Connection } from 'typeorm';
import { AppModule } from '../src/app.module';
import { AuthLoginDto } from '../src/auth/dto/auth-login.dto';
import { AuthModule } from '../src/auth/auth.module';
import { CreateCommitteeResultDto } from '../src/committee-result/dto/create-committee-result.dto';
import { Role } from '../src/auth/role.enum';
import { UserService } from '../src/user/services/user.service';
import { CommitteeResult } from '../src/committee-result/entities/committee-result.entity';
import { UpdateCommitteeResultDto } from '../src/committee-result/dto/update-committee-result.dto';
import { CommitteeResultService } from '../src/committee-result/services/committee-result.service';
import { CreateCommitteeResultStub } from '../src/committee-result/stubs/create-committee-result.stub';
import { CommitteeResultsModule } from '../src/committee-result/committee-result.module';

describe('CommitteeResultController (e2e)', () => {
  let app: INestApplication;
  let authToken;
  let service: CommitteeResultService;
  let userService: UserService;
  let connection: Connection;
  const BASE_URL = '/committee-results';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, AuthModule, CommitteeResultsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    service = moduleFixture.get<CommitteeResultService>(CommitteeResultService);
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

    await service.createCommitteeResult({
      name: 'CommitteeResult name 1',
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

  it('/committeeResults (POST)', async () => {
    const committeeResult: CreateCommitteeResultDto = CreateCommitteeResultStub;

    const response = await request(app.getHttpServer())
      .post(`${BASE_URL}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(committeeResult)
      .expect(HttpStatus.CREATED);

    expect(response.body.name).toBe(committeeResult.name);
  });

  it('/committeeResults (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`${BASE_URL}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.OK);

    const resources = response.body;

    const committeeResults = await service.getCommitteeResults({});

    expect(resources).toHaveLength(committeeResults.length);
  });

  it('/committeeResult/:id (GET)', async () => {
    const committeeResults = await service.getCommitteeResults({});

    const committeeResult: CommitteeResult = committeeResults[0];

    const response = await request(app.getHttpServer())
      .get(`${BASE_URL}/${committeeResult.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.OK);

    const resource: CommitteeResult = response.body;

    expect(resource.id).toBe(committeeResult.id);
  });

  it('/committeeResult/:id (PATCH)', async () => {
    const committeeResults = await service.getCommitteeResults({});

    const committeeResult: CommitteeResult = committeeResults[0];

    const updatedCommitteeResultDto: UpdateCommitteeResultDto = {
      name: 'new name committeeResult',
    };

    const response = await request(app.getHttpServer())
      .patch(`${BASE_URL}/${committeeResult.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedCommitteeResultDto)
      .expect(HttpStatus.OK);

    const resource: CommitteeResult = response.body;

    expect(resource.id).toBe(committeeResult.id);
    expect(resource.name).toBe(updatedCommitteeResultDto.name);
  });

  it('/committeeResult/:id (DELETE)', async () => {
    const committeeResults = await service.getCommitteeResults({});

    const committeeResult: CommitteeResult = committeeResults[0];

    const response = await request(app.getHttpServer())
      .delete(`${BASE_URL}/${committeeResult.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.OK);

    const resource: CommitteeResult = response.body;

    expect(resource).toStrictEqual({});
  });

  it("It should throw a NotFoundException if committeeResult doesn't exist", async () => {
    const unknownUuid = 999;

    const response = await request(app.getHttpServer())
      .get(`${BASE_URL}/${unknownUuid}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.NOT_FOUND);

    const resource: CommitteeResult = response.body;

    const errorResponseExample = {
      statusCode: 404,
      message: `CommitteeResult with ID "${unknownUuid}" not found`,
      error: 'Not Found',
    };

    expect(errorResponseExample).toStrictEqual(resource);
  });

  it('It should throw a BadRequestException if the required parameters were not sent', async () => {
    //El nombre de la organización no es enviado en el request
    const committeeResult = {
      telecom: 'Telecom for committeeResult 1',
    };
    const response = await request(app.getHttpServer())
      .post(`${BASE_URL}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(committeeResult)
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body.error).toBe('Bad Request');
  });

  afterAll(async () => {
    //await connection.synchronize(true);
    await app.close();
  });
});
