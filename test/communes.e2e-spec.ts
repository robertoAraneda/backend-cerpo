import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CommuneModule } from '../src/commune/commune.module';
import { Connection } from 'typeorm';
import { AppModule } from '../src/app.module';
import { AuthLoginDto } from '../src/auth/dto/auth-login.dto';
import { AuthModule } from '../src/auth/auth.module';
import { CreateCommuneDto } from '../src/commune/dto/create-commune.dto';
import { Role } from '../src/auth/role.enum';
import { UserService } from '../src/user/services/user.service';
import { Commune } from '../src/commune/entities/commune.entity';
import { UpdateCommuneDto } from '../src/commune/dto/update-commune.dto';
import { CommuneService } from '../src/commune/services/commune.service';
import CreateCommuneStub from '../src/commune/stubs/create-commune.stub';
import { Region } from '../src/region/entities/region.entity';
import { RegionModule } from '../src/region/region.module';
import { RegionService } from '../src/region/services/region.service';

describe('CommuneController (e2e)', () => {
  let app: INestApplication;
  let authToken;
  let service: CommuneService;
  let regionService: RegionService;
  let userService: UserService;
  let connection: Connection;
  let region: Region;
  const BASE_URL = '/communes';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, AuthModule, CommuneModule, RegionModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    service = moduleFixture.get<CommuneService>(CommuneService);
    regionService = moduleFixture.get<RegionService>(RegionService);
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

    region = await regionService.createRegion({
      name: 'region1',
      code: '03',
    });

    await service.createCommune({
      code: 'code 1',
      name: 'Commune name 1',
      region,
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

  it('/commune (POST)', async () => {
    const commune: CreateCommuneDto = CreateCommuneStub(region, 1);

    const response = await request(app.getHttpServer())
      .post(`${BASE_URL}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(commune)
      .expect(HttpStatus.CREATED);

    expect(response.body.name).toBe(commune.name);
  });

  it('/commune (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`${BASE_URL}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.OK);

    const resources = response.body;

    const communes = await service.getCommunes({});

    expect(resources).toHaveLength(communes.length);
  });

  it('/commune/:id (GET)', async () => {
    const communes = await service.getCommunes({});

    const commune: Commune = communes[0];

    const response = await request(app.getHttpServer())
      .get(`${BASE_URL}/${commune.code}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.OK);

    const resource: Commune = response.body;

    expect(resource.code).toBe(commune.code);
  });

  it('/commune/:id (PATCH)', async () => {
    const communes = await service.getCommunes({});

    const commune: Commune = communes[0];

    const updatedCommuneDto: UpdateCommuneDto = {
      name: 'new name commune',
    };

    const response = await request(app.getHttpServer())
      .patch(`${BASE_URL}/${commune.code}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedCommuneDto)
      .expect(HttpStatus.OK);

    const resource: Commune = response.body;

    expect(resource.code).toBe(commune.code);
    expect(resource.name).toBe(updatedCommuneDto.name);
  });

  it('/commune/:id (DELETE)', async () => {
    const communes = await service.getCommunes({});

    const commune: Commune = communes[0];

    const response = await request(app.getHttpServer())
      .delete(`${BASE_URL}/${commune.code}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.OK);

    const resource: Commune = response.body;

    expect(resource).toStrictEqual({});
  });

  it("It should throw a NotFoundException if commune doesn't exist", async () => {
    const unknownUuid = 'unknown code';

    const response = await request(app.getHttpServer())
      .get(`${BASE_URL}/${unknownUuid}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.NOT_FOUND);

    const resource: Commune = response.body;

    const errorResponseExample = {
      statusCode: 404,
      message: `Commune with code "${unknownUuid}" not found`,
      error: 'Not Found',
    };

    expect(errorResponseExample).toStrictEqual(resource);
  });

  it('It should throw a BadRequestException if the required parameters were not sent', async () => {
    //El nombre de la organización no es enviado en el request
    const commune = {
      telecom: 'Telecom for commune 1',
    };
    const response = await request(app.getHttpServer())
      .post(`${BASE_URL}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(commune)
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body.error).toBe('Bad Request');
  });

  afterAll(async () => {
    //await connection.synchronize(true);
    await app.close();
  });
});
