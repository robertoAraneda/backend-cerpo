import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { RegionsModule } from '../src/regions/regions.module';
import { Connection } from 'typeorm';
import { AppModule } from '../src/app.module';
import { AuthLoginDto } from '../src/auth/dto/auth-login.dto';
import { AuthModule } from '../src/auth/auth.module';
import { CreateRegionDto } from '../src/regions/dto/create-region.dto';
import { Role } from '../src/auth/role.enum';
import { UsersService } from '../src/users/services/users.service';
import { Region } from '../src/regions/entities/region.entity';
import { UpdateRegionDto } from '../src/regions/dto/update-region.dto';
import { RegionsService } from '../src/regions/services/regions.service';
import { CreateRegionStub } from '../src/regions/stubs/create-region.stub';

describe('RegionsController (e2e)', () => {
  let app: INestApplication;
  let authToken;
  let service: RegionsService;
  let userService: UsersService;
  let connection: Connection;
  const BASE_URL = '/regions';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, AuthModule, RegionsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    service = moduleFixture.get<RegionsService>(RegionsService);
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

    await service.createRegion({
      name: 'Region name 1',
      code: 'code',
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

  it('/regions (POST)', async () => {
    const region: CreateRegionDto = CreateRegionStub;

    const response = await request(app.getHttpServer())
      .post(`${BASE_URL}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(region)
      .expect(HttpStatus.CREATED);

    expect(response.body.name).toBe(region.name);
  });

  it('/regions (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`${BASE_URL}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.OK);

    const resources = response.body;

    const regions = await service.getRegions({});

    expect(resources).toHaveLength(regions.length);
  });

  it('/region/:id (GET)', async () => {
    const regions = await service.getRegions({});

    const region: Region = regions[0];

    const response = await request(app.getHttpServer())
      .get(`${BASE_URL}/${region.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.OK);

    const resource: Region = response.body;

    expect(resource.id).toBe(region.id);
  });

  it('/region/:id (PATCH)', async () => {
    const regions = await service.getRegions({});

    const region: Region = regions[0];

    const updatedRegionDto: UpdateRegionDto = {
      name: 'new name region',
    };

    const response = await request(app.getHttpServer())
      .patch(`${BASE_URL}/${region.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedRegionDto)
      .expect(HttpStatus.OK);

    const resource: Region = response.body;

    expect(resource.id).toBe(region.id);
    expect(resource.name).toBe(updatedRegionDto.name);
  });

  it('/region/:id (DELETE)', async () => {
    const regions = await service.getRegions({});

    const region: Region = regions[0];

    const response = await request(app.getHttpServer())
      .delete(`${BASE_URL}/${region.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.OK);

    const resource: Region = response.body;

    expect(resource).toStrictEqual({});
  });

  it("It should throw a NotFoundException if region doesn't exist", async () => {
    const unknownUuid = 999;

    const response = await request(app.getHttpServer())
      .get(`${BASE_URL}/${unknownUuid}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.NOT_FOUND);

    const resource: Region = response.body;

    const errorResponseExample = {
      statusCode: 404,
      message: `Region with ID "${unknownUuid}" not found`,
      error: 'Not Found',
    };

    expect(errorResponseExample).toStrictEqual(resource);
  });

  it('It should throw a BadRequestException if the required parameters were not sent', async () => {
    //El nombre de la organización no es enviado en el request
    const region = {
      telecom: 'Telecom for region 1',
    };
    const response = await request(app.getHttpServer())
      .post(`${BASE_URL}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(region)
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body.error).toBe('Bad Request');
  });

  afterAll(async () => {
    //await connection.synchronize(true);
    await app.close();
  });
});
