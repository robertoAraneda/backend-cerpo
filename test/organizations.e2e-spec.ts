import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { OrganizationsModule } from '../src/organizations/organizations.module';
import { Connection } from 'typeorm';
import { AppModule } from '../src/app.module';
import { AuthLoginDto } from '../src/auth/dto/auth-login.dto';
import { AuthModule } from '../src/auth/auth.module';
import { CreateOrganizationDto } from '../src/organizations/dto/create-organization.dto';
import { Role } from '../src/auth/role.enum';
import { UsersService } from '../src/users/services/users.service';
import { Organization } from '../src/organizations/entities/organization.entity';
import { UpdateOrganizationDto } from '../src/organizations/dto/update-organization.dto';
import { OrganizationsService } from '../src/organizations/services/organizations.service';
import { OrganizationTypeEnum } from '../src/organizations/enums/organization-type.enum';
import { OrganizationStub } from '../src/organizations/stubs/organization.stub';

describe('OrganizationsController (e2e)', () => {
  let app: INestApplication;
  let authToken;
  let service: OrganizationsService;
  let userService: UsersService;
  let connection: Connection;
  const BASE_URL = '/organizations';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, AuthModule, OrganizationsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    service = moduleFixture.get<OrganizationsService>(OrganizationsService);
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

    await service.createOrganization({
      name: 'Organization name 1',
      telecom: 'Telecom organization 1',
      type: OrganizationTypeEnum.CONSULTANT,
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

  it('/organizations (POST)', async () => {
    const organization: CreateOrganizationDto = OrganizationStub;

    const response = await request(app.getHttpServer())
      .post(`${BASE_URL}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(organization)
      .expect(HttpStatus.CREATED);

    expect(response.body.name).toBe(organization.name);
    expect(response.body.telecom).toBe(organization.telecom);
    expect(response.body.type).toBe(organization.type);
  });

  it('/organizations (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`${BASE_URL}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.OK);

    const resources = response.body;

    const organizations = await service.getOrganizations({});

    expect(resources).toHaveLength(organizations.length);
  });

  it('/organization/:id (GET)', async () => {
    const organizations = await service.getOrganizations({});

    const organization: Organization = organizations[0];

    const response = await request(app.getHttpServer())
      .get(`${BASE_URL}/${organization.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.OK);

    const resource: Organization = response.body;

    expect(resource.id).toBe(organization.id);
  });

  it('/organization/:id (PATCH)', async () => {
    const organizations = await service.getOrganizations({});

    const organization: Organization = organizations[0];

    const updatedOrganizationDto: UpdateOrganizationDto = {
      name: 'new name organization',
    };

    const response = await request(app.getHttpServer())
      .patch(`${BASE_URL}/${organization.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedOrganizationDto);
    //.expect(HttpStatus.OK);

    console.log(response);

    const resource: Organization = response.body;

    expect(resource.id).toBe(organization.id);
    expect(resource.name).toBe(updatedOrganizationDto.name);
  });

  it('/organization/:id (DELETE)', async () => {
    const organizations = await service.getOrganizations({});

    const organization: Organization = organizations[0];

    const response = await request(app.getHttpServer())
      .delete(`${BASE_URL}/${organization.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.OK);

    const resource: Organization = response.body;

    expect(resource).toStrictEqual({});
  });

  it("It should throw a NotFoundException if organization doesn't exist", async () => {
    const unknownUuid = '123e4567-e89b-12d3-a456-426614174000';

    const response = await request(app.getHttpServer())
      .get(`${BASE_URL}/${unknownUuid}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.NOT_FOUND);

    const resource: Organization = response.body;

    const errorResponseExample = {
      statusCode: 404,
      message: `Organization with ID "${unknownUuid}" not found`,
      error: 'Not Found',
    };

    expect(errorResponseExample).toStrictEqual(resource);
  });

  it('It should throw a BadRequestException if the required parameters were not sent', async () => {
    //El nombre de la organización no es enviado en el request
    const organization = {
      telecom: 'Telecom for organization 1',
      type: OrganizationTypeEnum.CONSULTANT,
    };
    const response = await request(app.getHttpServer())
      .post(`${BASE_URL}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(organization)
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body.error).toBe('Bad Request');
  });

  afterAll(async () => {
    //await connection.synchronize(true);
    await app.close();
  });
});