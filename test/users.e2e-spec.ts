import { HttpStatus, INestApplication } from '@nestjs/common';
import { PatientsService } from '../src/patients/services/patients.service';
import { UsersService } from '../src/users/services/users.service';
import { Connection } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { AuthModule } from '../src/auth/auth.module';
import { PatientsModule } from '../src/patients/patients.module';
import { Role } from '../src/auth/role.enum';
import { AuthLoginDto } from '../src/auth/dto/auth-login.dto';
import * as request from 'supertest';
import { CreatePatientDto } from '../src/patients/dto/create-patient.dto';
import { Patient } from '../src/patients/entities/patient.entity';
import { UpdatePatientDto } from '../src/patients/dto/update-patient.dto';
import { UsersModule } from '../src/users/users.module';

describe('PatientController (e2e)', () => {
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

    //const patients = await service.getPatients({});
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

  it('/patients (POST)', async () => {
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
      .post('/patients')
      .set('Authorization', `Bearer ${authToken}`)
      .send(patient)
      .expect(HttpStatus.CREATED);

    expect(response.body.rut).toBe(patient.rut);
    expect(response.body.given).toBe(patient.given);
    expect(response.body.fatherFamily).toBe(patient.fatherFamily);
    expect(response.body.motherFamily).toBe(patient.motherFamily);
  });

  it('/patients (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/patients')
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
      .get(`/patients/${patient.id}`)
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
      .patch(`/patients/${patient.id}`)
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
      .delete(`/patients/${patient.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.OK);

    const resource: Patient = response.body;

    expect(resource).toStrictEqual({});
  });

  it("It should throw a NotFoundException if patient doesn't exist", async () => {
    const unknownUuid = '123e4567-e89b-12d3-a456-426614174000';

    const response = await request(app.getHttpServer())
      .get(`/patients/${unknownUuid}`)
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
      .patch(`/patients/${patient.id}`)
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
      .patch(`/patients/${patient.id}`)
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
      .post('/patients')
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
