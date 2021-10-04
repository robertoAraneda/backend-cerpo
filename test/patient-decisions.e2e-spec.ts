import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { Connection } from 'typeorm';
import { AppModule } from '../src/app.module';
import { AuthLoginDto } from '../src/auth/dto/auth-login.dto';
import { AuthModule } from '../src/auth/auth.module';
import { CreatePatientDecisionDto } from '../src/patient-decisions/dto/create-patient-decision.dto';
import { Role } from '../src/auth/role.enum';
import { UsersService } from '../src/users/services/users.service';
import { PatientDecision } from '../src/patient-decisions/entities/patient-decision.entity';
import { UpdatePatientDecisionDto } from '../src/patient-decisions/dto/update-patient-decision.dto';
import { PatientDecisionsService } from '../src/patient-decisions/services/patient-decisions.service';
import { CreatePatientDecisionStub } from '../src/patient-decisions/stubs/create-patient-decision.stub';
import { PatientDecisionsModule } from '../src/patient-decisions/patient-decisions.module';

describe('PatientDecisionsController (e2e)', () => {
  let app: INestApplication;
  let authToken;
  let service: PatientDecisionsService;
  let userService: UsersService;
  let connection: Connection;
  const BASE_URL = '/patient-decisions';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, AuthModule, PatientDecisionsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    service = moduleFixture.get<PatientDecisionsService>(
      PatientDecisionsService,
    );
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

    await service.createPatientDecision({
      name: 'PatientDecision name 1',
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

  it('/patientDecisions (POST)', async () => {
    const patientDecision: CreatePatientDecisionDto = CreatePatientDecisionStub;

    const response = await request(app.getHttpServer())
      .post(`${BASE_URL}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(patientDecision)
      .expect(HttpStatus.CREATED);

    expect(response.body.name).toBe(patientDecision.name);
  });

  it('/patientDecisions (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`${BASE_URL}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.OK);

    const resources = response.body;

    const patientDecisions = await service.getPatientDecisions({});

    expect(resources).toHaveLength(patientDecisions.length);
  });

  it('/patientDecision/:id (GET)', async () => {
    const patientDecisions = await service.getPatientDecisions({});

    const patientDecision: PatientDecision = patientDecisions[0];

    const response = await request(app.getHttpServer())
      .get(`${BASE_URL}/${patientDecision.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.OK);

    const resource: PatientDecision = response.body;

    expect(resource.id).toBe(patientDecision.id);
  });

  it('/patientDecision/:id (PATCH)', async () => {
    const patientDecisions = await service.getPatientDecisions({});

    const patientDecision: PatientDecision = patientDecisions[0];

    const updatedPatientDecisionDto: UpdatePatientDecisionDto = {
      name: 'new name patientDecision',
    };

    const response = await request(app.getHttpServer())
      .patch(`${BASE_URL}/${patientDecision.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedPatientDecisionDto)
      .expect(HttpStatus.OK);

    const resource: PatientDecision = response.body;

    expect(resource.id).toBe(patientDecision.id);
    expect(resource.name).toBe(updatedPatientDecisionDto.name);
  });

  it('/patientDecision/:id (DELETE)', async () => {
    const patientDecisions = await service.getPatientDecisions({});

    const patientDecision: PatientDecision = patientDecisions[0];

    const response = await request(app.getHttpServer())
      .delete(`${BASE_URL}/${patientDecision.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.OK);

    const resource: PatientDecision = response.body;

    expect(resource).toStrictEqual({});
  });

  it("It should throw a NotFoundException if patientDecision doesn't exist", async () => {
    const unknownUuid = 999;

    const response = await request(app.getHttpServer())
      .get(`${BASE_URL}/${unknownUuid}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.NOT_FOUND);

    const resource: PatientDecision = response.body;

    const errorResponseExample = {
      statusCode: 404,
      message: `PatientDecision with ID "${unknownUuid}" not found`,
      error: 'Not Found',
    };

    expect(errorResponseExample).toStrictEqual(resource);
  });

  it('It should throw a BadRequestException if the required parameters were not sent', async () => {
    //El nombre de la organización no es enviado en el request
    const patientDecision = {
      telecom: 'Telecom for patientDecision 1',
    };
    const response = await request(app.getHttpServer())
      .post(`${BASE_URL}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(patientDecision)
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body.error).toBe('Bad Request');
  });

  afterAll(async () => {
    //await connection.synchronize(true);
    await app.close();
  });
});
