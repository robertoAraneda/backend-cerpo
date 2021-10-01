import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DeliveryRoutesModule } from '../src/delivery-routes/delivery-routes.module';
import { Connection } from 'typeorm';
import { AppModule } from '../src/app.module';
import { AuthLoginDto } from '../src/auth/dto/auth-login.dto';
import { AuthModule } from '../src/auth/auth.module';
import { CreateDeliveryRouteDto } from '../src/delivery-routes/dto/create-delivery-route.dto';
import { Role } from '../src/auth/role.enum';
import { UsersService } from '../src/users/services/users.service';
import { DeliveryRoute } from '../src/delivery-routes/entities/delivery-route.entity';
import { UpdateDeliveryRouteDto } from '../src/delivery-routes/dto/update-delivery-route.dto';
import { DeliveryRoutesService } from '../src/delivery-routes/services/delivery-routes.service';
import { CreateDeliveryRouteStub } from '../src/delivery-routes/stubs/create-delivery-route.stub';

describe('DeliveryRoutesController (e2e)', () => {
  let app: INestApplication;
  let authToken;
  let service: DeliveryRoutesService;
  let userService: UsersService;
  let connection: Connection;
  const BASE_URL = '/delivery-routes';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, AuthModule, DeliveryRoutesModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    service = moduleFixture.get<DeliveryRoutesService>(DeliveryRoutesService);
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

    await service.createDeliveryRoute({
      name: 'DeliveryRoute name 1',
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

  it('/deliveryRoutes (POST)', async () => {
    const deliveryRoute: CreateDeliveryRouteDto = CreateDeliveryRouteStub;

    const response = await request(app.getHttpServer())
      .post(`${BASE_URL}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(deliveryRoute)
      .expect(HttpStatus.CREATED);

    expect(response.body.name).toBe(deliveryRoute.name);
  });

  it('/deliveryRoutes (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`${BASE_URL}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.OK);

    const resources = response.body;

    const deliveryRoutes = await service.getDeliveryRoutes({});

    expect(resources).toHaveLength(deliveryRoutes.length);
  });

  it('/deliveryRoute/:id (GET)', async () => {
    const deliveryRoutes = await service.getDeliveryRoutes({});

    const deliveryRoute: DeliveryRoute = deliveryRoutes[0];

    const response = await request(app.getHttpServer())
      .get(`${BASE_URL}/${deliveryRoute.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.OK);

    const resource: DeliveryRoute = response.body;

    expect(resource.id).toBe(deliveryRoute.id);
  });

  it('/deliveryRoute/:id (PATCH)', async () => {
    const deliveryRoutes = await service.getDeliveryRoutes({});

    const deliveryRoute: DeliveryRoute = deliveryRoutes[0];

    const updatedDeliveryRouteDto: UpdateDeliveryRouteDto = {
      name: 'new name deliveryRoute',
    };

    const response = await request(app.getHttpServer())
      .patch(`${BASE_URL}/${deliveryRoute.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedDeliveryRouteDto)
      .expect(HttpStatus.OK);

    const resource: DeliveryRoute = response.body;

    expect(resource.id).toBe(deliveryRoute.id);
    expect(resource.name).toBe(updatedDeliveryRouteDto.name);
  });

  it('/deliveryRoute/:id (DELETE)', async () => {
    const deliveryRoutes = await service.getDeliveryRoutes({});

    const deliveryRoute: DeliveryRoute = deliveryRoutes[0];

    const response = await request(app.getHttpServer())
      .delete(`${BASE_URL}/${deliveryRoute.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.OK);

    const resource: DeliveryRoute = response.body;

    expect(resource).toStrictEqual({});
  });

  it("It should throw a NotFoundException if deliveryRoute doesn't exist", async () => {
    const unknownUuid = '123e4567-e89b-12d3-a456-426614174000';

    const response = await request(app.getHttpServer())
      .get(`${BASE_URL}/${unknownUuid}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.NOT_FOUND);

    const resource: DeliveryRoute = response.body;

    const errorResponseExample = {
      statusCode: 404,
      message: `DeliveryRoute with ID "${unknownUuid}" not found`,
      error: 'Not Found',
    };

    expect(errorResponseExample).toStrictEqual(resource);
  });

  it('It should throw a BadRequestException if the required parameters were not sent', async () => {
    //El nombre de la organización no es enviado en el request
    const deliveryRoute = {
      telecom: 'Telecom for deliveryRoute 1',
    };
    const response = await request(app.getHttpServer())
      .post(`${BASE_URL}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(deliveryRoute)
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body.error).toBe('Bad Request');
  });

  afterAll(async () => {
    //await connection.synchronize(true);
    await app.close();
  });
});
