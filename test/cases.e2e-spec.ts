import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CaseModule } from '../src/case/case.module';
import { Connection } from 'typeorm';
import { AppModule } from '../src/app.module';
import { AuthLoginDto } from '../src/auth/dto/auth-login.dto';
import { AuthModule } from '../src/auth/auth.module';
import { CreateCaseDto } from '../src/case/dto/create-case.dto';
import { Role } from '../src/auth/role.enum';
import { UserService } from '../src/user/services/user.service';
import { Case } from '../src/case/entities/case.entity';
import { UpdateCaseDto } from '../src/case/dto/update-case.dto';
import { CaseService } from '../src/case/services/case.service';
import CreateCaseStub from '../src/case/stubs/create-case.stub';
import { Patient } from '../src/patient/entities/patient.entity';
import { CreatePatientStub } from '../src/patient/stubs/create-patient.stub';
import { System } from '../src/system/entities/system.entity';
import { CreateSystemStub } from '../src/system/stubs/create-system.stub';
import { Organization } from '../src/organization/entities/organization.entity';
import { CreateOrganizationStub } from '../src/organization/stubs/create-organization.stub';
import { User } from '../src/user/entities/user.entity';
import CreateUserStub from '../src/user/stubs/create-user.stub';
import { DeliveryRoute } from '../src/delivery-route/entities/delivery-route.entity';
import { CreateDeliveryRouteStub } from '../src/delivery-route/stubs/create-delivery-route.stub';
import { CommitteeResult } from '../src/committee-result/entities/committee-result.entity';
import { CreateCommitteeResultStub } from '../src/committee-result/stubs/create-committee-result.stub';
import { StatusCase } from '../src/status-case/entities/status-case.entity';
import { CreateStatusCaseStub } from '../src/status-case/stubs/create-status-case.stub';
import { PatientService } from '../src/patient/services/patient.service';
import { SystemService } from '../src/system/services/system.service';
import { OrganizationService } from '../src/organization/services/organization.service';
import { DeliveryRouteService } from '../src/delivery-route/services/delivery-route.service';
import { CommitteeResultService } from '../src/committee-result/services/committee-result.service';
import { StatusCaseService } from '../src/status-case/services/status-case.service';

describe('CaseController (e2e)', () => {
  let app: INestApplication;
  let authToken;
  let service: CaseService;
  let userService: UserService;
  let connection: Connection;

  let patientService: PatientService;
  let systemService: SystemService;
  let organizationService: OrganizationService;
  let deliveryRouteService: DeliveryRouteService;
  let committeeResultService: CommitteeResultService;
  let statusCaseService: StatusCaseService;

  let cases: Case[];
  let createCaseDto: CreateCaseDto;
  const BASE_URL = '/cases';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, AuthModule, CaseModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    service = moduleFixture.get<CaseService>(CaseService);
    userService = moduleFixture.get<UserService>(UserService);
    patientService = moduleFixture.get<PatientService>(PatientService);
    systemService = moduleFixture.get<SystemService>(SystemService);
    organizationService =
      moduleFixture.get<OrganizationService>(OrganizationService);
    deliveryRouteService =
      moduleFixture.get<DeliveryRouteService>(DeliveryRouteService);
    committeeResultService = moduleFixture.get<CommitteeResultService>(
      CommitteeResultService,
    );
    statusCaseService = moduleFixture.get<StatusCaseService>(StatusCaseService);

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

    const patient: Patient = await patientService.createPatient(
      CreatePatientStub,
    );
    const system: System = await systemService.createSystem(CreateSystemStub);
    const organization: Organization =
      await organizationService.createOrganization(CreateOrganizationStub);

    const practitioner: User = await userService.createUser(
      CreateUserStub('K'),
    );
    const deliveryRoute: DeliveryRoute =
      await deliveryRouteService.createDeliveryRoute(CreateDeliveryRouteStub);
    const committeeResult: CommitteeResult =
      await committeeResultService.createCommitteeResult(
        CreateCommitteeResultStub,
      );

    const statusCase: StatusCase = await statusCaseService.createStatusCase(
      CreateStatusCaseStub,
    );

    const round = 3;

    //se cra un caso para ser rutilizado
    createCaseDto = CreateCaseStub(
      patient,
      committeeResult,
      deliveryRoute,
      organization,
      practitioner,
      statusCase,
      system,
    );

    await service.createCase(createCaseDto);

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

  it('/case (POST)', async () => {
    const caseEntity: CreateCaseDto = createCaseDto;

    const response = await request(app.getHttpServer())
      .post(`${BASE_URL}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(caseEntity)
      .expect(HttpStatus.CREATED);

    expect(response.body.title).toBe(caseEntity.title);
  });

  it('/case (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`${BASE_URL}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.OK);

    const resources = response.body;

    const cases = await service.getCases({});

    expect(resources).toHaveLength(cases.length);
  });

  it('/case/:id (GET)', async () => {
    const cases = await service.getCases({});

    const caseEntity: Case = cases[0];

    const response = await request(app.getHttpServer())
      .get(`${BASE_URL}/${caseEntity.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.OK);

    const resource: Case = response.body;

    expect(resource.id).toBe(caseEntity.id);
  });

  it('/case/:id (PATCH)', async () => {
    const cases = await service.getCases({});

    const caseEntity: Case = cases[0];

    const updatedCaseDto: UpdateCaseDto = {
      title: 'new name case',
    };

    const response = await request(app.getHttpServer())
      .patch(`${BASE_URL}/${caseEntity.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedCaseDto)
      .expect(HttpStatus.OK);

    const resource: Case = response.body;

    expect(resource.id).toBe(caseEntity.id);
    expect(resource.title).toBe(updatedCaseDto.title);
  });

  it('/case/:id (DELETE)', async () => {
    const cases = await service.getCases({});

    const caseEntity: Case = cases[0];

    const response = await request(app.getHttpServer())
      .delete(`${BASE_URL}/${caseEntity.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.OK);

    const resource: Case = response.body;

    expect(resource).toStrictEqual({});
  });

  it("It should throw a NotFoundException if case doesn't exist", async () => {
    const unknownUuid = 999;

    const response = await request(app.getHttpServer())
      .get(`${BASE_URL}/${unknownUuid}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.NOT_FOUND);

    const resource: Case = response.body;

    const errorResponseExample = {
      statusCode: 404,
      message: `Case with ID "${unknownUuid}" not found`,
      error: 'Not Found',
    };

    expect(errorResponseExample).toStrictEqual(resource);
  });

  it('It should throw a BadRequestException if the required parameters were not sent', async () => {
    //El nombre de la organización no es enviado en el request
    const caseEntity = {
      title: 'Telecom for case 1',
    };
    const response = await request(app.getHttpServer())
      .post(`${BASE_URL}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(caseEntity)
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body.error).toBe('Bad Request');
  });

  afterAll(async () => {
    //await connection.synchronize(true);
    await app.close();
  });
});
