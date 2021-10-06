import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { RegionModule } from '../src/region/region.module';
import { Connection } from 'typeorm';
import { AppModule } from '../src/app.module';
import { AuthLoginDto } from '../src/auth/dto/auth-login.dto';
import { AuthModule } from '../src/auth/auth.module';
import { CreateRegionDto } from '../src/region/dto/create-region.dto';
import { Role } from '../src/auth/role.enum';
import { UserService } from '../src/user/services/user.service';
import { Region } from '../src/region/entities/region.entity';
import { UpdateRegionDto } from '../src/region/dto/update-region.dto';
import { RegionService } from '../src/region/services/region.service';
import { CreateRegionStub } from '../src/region/stubs/create-region.stub';

describe('RegionController (e2e)', () => {
  let app: INestApplication;
  let authToken;
  let service: RegionService;
  let userService: UserService;
  let connection: Connection;
  const BASE_URL = '/regions';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, AuthModule, RegionModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    service = moduleFixture.get<RegionService>(RegionService);
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

  it('/region (POST)', async () => {
    const region: CreateRegionDto = CreateRegionStub;

    const response = await request(app.getHttpServer())
      .post(`${BASE_URL}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(region)
      .expect(HttpStatus.CREATED);

    expect(response.body.name).toBe(region.name);
  });

  it('/region (GET)', async () => {
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
      .get(`${BASE_URL}/${region.code}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.OK);

    const resource: Region = response.body;

    expect(resource.code).toBe(region.code);
  });

  it('/region/:id (PATCH)', async () => {
    const regions = await service.getRegions({});

    const region: Region = regions[0];

    const updatedRegionDto: UpdateRegionDto = {
      name: 'new name region',
    };

    const response = await request(app.getHttpServer())
      .patch(`${BASE_URL}/${region.code}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedRegionDto)
      .expect(HttpStatus.OK);

    const resource: Region = response.body;

    expect(resource.code).toBe(region.code);
    expect(resource.name).toBe(updatedRegionDto.name);
  });

  it('/region/:id (DELETE)', async () => {
    const regions = await service.getRegions({});

    const region: Region = regions[0];

    const response = await request(app.getHttpServer())
      .delete(`${BASE_URL}/${region.code}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.OK);

    const resource: Region = response.body;

    expect(resource).toStrictEqual({});
  });

  it("It should throw a NotFoundException if region doesn't exist", async () => {
    const unknownUuid = 'unknown code';

    const response = await request(app.getHttpServer())
      .get(`${BASE_URL}/${unknownUuid}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.NOT_FOUND);

    const resource: Region = response.body;

    const errorResponseExample = {
      statusCode: 404,
      message: `Region with code "${unknownUuid}" not found`,
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
