import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PatientModule } from '../src/patient/patient.module';
import { Connection } from 'typeorm';
import { AppModule } from '../src/app.module';
import { AuthLoginDto } from '../src/auth/dto/auth-login.dto';
import { AuthModule } from '../src/auth/auth.module';
import { PatientService } from '../src/patient/services/patient.service';
import { CreatePatientDto } from '../src/patient/dto/create-patient.dto';
import { Role } from '../src/auth/role.enum';
import { UserService } from '../src/user/services/user.service';
import { Patient } from '../src/patient/entities/patient.entity';
import { UpdatePatientDto } from '../src/patient/dto/update-patient.dto';

describe('PatientController (e2e)', () => {
  let app: INestApplication;
  let authToken;
  let service: PatientService;
  let userService: UserService;
  let connection: Connection;
  const BASE_URL = '/patients';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, AuthModule, PatientModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    service = moduleFixture.get<PatientService>(PatientService);
    userService = moduleFixture.get<UserService>(UserService);
    connection = app.get(Connection);

    await connection.synchronize(true);

    //const patient = await service.getPatients({});
    await userService.createUser({
      rut: '15654738-7',
      given: 'ROBERTO ALEJANDRO',
      fatherFamily: 'ARANEDA',
      motherFamily: 'ESPINOZA',
      email: 'robaraneda@gmail.com',
      password: 'admin',
      role: Role.ADMIN,
    });

    await service.createPatient({
      rut: '15654738-7',
      address: 'AMUNATEGUI 890',
      birthdate: '1983-12-06',
      mobile: '+56958639620',
      phone: '45-2559023',
      given: 'ROBERTO ALEJANDRO',
      fatherFamily: 'ARANEDA',
      motherFamily: 'ESPINOZA',
      email: 'robaraneda@gmail.com',
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

  it('/patient (POST)', async () => {
    const patient: CreatePatientDto = {
      rut: '15549763-7',
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
      .post(`${BASE_URL}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(patient)
      .expect(HttpStatus.CREATED);

    expect(response.body.rut).toBe(patient.rut);
    expect(response.body.given).toBe(patient.given);
    expect(response.body.fatherFamily).toBe(patient.fatherFamily);
    expect(response.body.motherFamily).toBe(patient.motherFamily);
  });

  it('/patient (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`${BASE_URL}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.OK);

    const resources = response.body;

    const patients = await service.getPatients({});

    expect(resources).toHaveLength(patients.length);
  });

  it('/patient/:id (GET)', async () => {
    const patients = await service.getPatients({});

    const patient: Patient = patients[0];

    const response = await request(app.getHttpServer())
      .get(`${BASE_URL}/${patient.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.OK);

    const resource: Patient = response.body;

    expect(resource.id).toBe(patient.id);
  });

  it('/patient/:id (PATCH)', async () => {
    const patients = await service.getPatients({});

    const patient: Patient = patients[0];

    const updatedPatientDto: UpdatePatientDto = {
      rut: '16317005-1',
      address: 'JUAN ENRIQUE RODO 05080',
      email: 'c.alarconlazo@gmail.com',
    };

    const response = await request(app.getHttpServer())
      .patch(`${BASE_URL}/${patient.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedPatientDto)
      .expect(HttpStatus.OK);

    const resource: Patient = response.body;

    expect(resource.id).toBe(patient.id);
    expect(resource.email).toBe(updatedPatientDto.email);
    expect(resource.address).toBe(updatedPatientDto.address);
    expect(resource.rut).toBe(updatedPatientDto.rut);
  });

  it('/patient/:id (DELETE)', async () => {
    const patients = await service.getPatients({});

    const patient: Patient = patients[0];

    const response = await request(app.getHttpServer())
      .delete(`${BASE_URL}/${patient.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.OK);

    const resource: Patient = response.body;

    expect(resource).toStrictEqual({});
  });

  it("It should throw a NotFoundException if patient doesn't exist", async () => {
    const unknownUuid = 999;

    const response = await request(app.getHttpServer())
      .get(`${BASE_URL}/${unknownUuid}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.NOT_FOUND);

    const resource: Patient = response.body;

    const errorResponseExample = {
      statusCode: 404,
      message: `Patient with ID "${unknownUuid}" not found`,
      error: 'Not Found',
    };

    expect(errorResponseExample).toStrictEqual(resource);
  });

  it('It should throw a ConflictException if patient will updated with an existing email', async () => {
    const patients = await service.getPatients({});

    const createPatientDto: CreatePatientDto = {
      rut: '10669322-6',
      address: 'JUAN ENRIQUE RODO 05080',
      birthdate: '1984-06-25',
      mobile: '+56988558845',
      phone: '45-2559023',
      given: 'CLAUDIA ANDREA',
      fatherFamily: 'CONTRERAS',
      motherFamily: 'MELLADO',
      email: 'robaraneda@gmail.com',
    };

    await service.createPatient(createPatientDto);

    const patient: Patient = patients[0];

    const updatedPatientDto: UpdatePatientDto = {
      rut: '16317005-1',
      address: 'JUAN ENRIQUE RODO 05080',
      email: createPatientDto.email,
    };

    const response = await request(app.getHttpServer())
      .patch(`${BASE_URL}/${patient.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedPatientDto)
      .expect(HttpStatus.CONFLICT);

    const resource: Patient = response.body;

    const errorResponseExample = {
      statusCode: 409,
      message: `Patient with this email "${createPatientDto.email}" already exists.`,
      error: 'Conflict',
    };

    expect(errorResponseExample).toStrictEqual(resource);
  });

  it('It should throw a ConflictException if patient will updated with an existing rut', async () => {
    const patients = await service.getPatients({});

    const createPatientDto: CreatePatientDto = {
      rut: '15654738-7',
      address: 'JUAN ENRIQUE RODO 05080',
      birthdate: '1984-06-25',
      mobile: '+56988558845',
      phone: '45-2559023',
      given: 'CLAUDIA ANDREA',
      fatherFamily: 'CONTRERAS',
      motherFamily: 'MELLADO',
      email: 'kuyenko@gmail.com',
    };

    await service.createPatient(createPatientDto);

    const patient: Patient = patients[0];

    const updatedPatientDto: UpdatePatientDto = {
      rut: createPatientDto.rut,
      address: 'JUAN ENRIQUE RODO 05080',
      email: 'kuyenko@yahoo.es',
    };

    const response = await request(app.getHttpServer())
      .patch(`${BASE_URL}/${patient.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedPatientDto)
      .expect(HttpStatus.CONFLICT);

    const resource: Patient = response.body;

    const errorResponseExample = {
      statusCode: 409,
      message: `Patient with this rut "${createPatientDto.rut}" already exists.`,
      error: 'Conflict',
    };

    expect(errorResponseExample).toStrictEqual(resource);
  });

  it('It should throw a BadRequestException if the required parameters were not sent', async () => {
    //El rut del paciente no es enviado en el request
    const patient = {
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
      .post(`${BASE_URL}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(patient)
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body.error).toBe('Bad Request');
  });

  afterAll(async () => {
    //await connection.synchronize(true);
    await app.close();
  });
});
