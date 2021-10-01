import { DeliveryRoutesRepository } from './delivery-routes.repository';
import { Connection } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { createMemDB } from '../../config/create-memory-database';
import { DeliveryRoute } from '../entities/delivery-route.entity';
import { DeliveryRoutesStub } from '../stubs/delivery-routes.stub';
import { GetDeliveryRoutesFilterDto } from '../dto/get-delivery-routes-filter.dto';
import { UpdateDeliveryRouteDto } from '../dto/update-delivery-route.dto';
import { CreateDeliveryRouteStub } from '../stubs/create-delivery-route.stub';

describe('DeliveryRoutesRepository', () => {
  let repository: DeliveryRoutesRepository;
  let db: Connection;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [],
    }).compile();
    db = await createMemDB([DeliveryRoute]);
    repository = db.getCustomRepository<DeliveryRoutesRepository>(
      DeliveryRoutesRepository,
    );
  });

  afterEach(() => db.close());

  it('should repository be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('getDeliveryRoutes', () => {
    beforeEach(async () => {
      await Promise.all(
        DeliveryRoutesStub.getAll().map(async (deliveryRoute) => {
          await repository.createDeliveryRoute(deliveryRoute);
        }),
      );
    });

    it('should return and array of DeliveryRoutes', async () => {
      const mockedDeliveryRoutes: DeliveryRoute[] = DeliveryRoutesStub.getAll();
      jest.spyOn(repository, 'getDeliveryRoutes');

      const filterDto = {};

      const deliveryRoutes = await repository.find();

      expect(await repository.getDeliveryRoutes(filterDto)).toStrictEqual(
        deliveryRoutes,
      );

      expect(deliveryRoutes.length).toBe(mockedDeliveryRoutes.length);
    });

    it('should return and array of filtered DeliveryRoutes', async () => {
      const mockedDeliveryRoutes: DeliveryRoute[] = DeliveryRoutesStub.getAll();

      jest.spyOn(repository, 'getDeliveryRoutes');

      const deliveryRoutes = await repository.find();

      const filterDto: GetDeliveryRoutesFilterDto = {
        name: 'DeliveryRoute 1',
      };

      expect(await repository.getDeliveryRoutes(filterDto)).toStrictEqual(
        [...deliveryRoutes].filter((deliveryRoute) =>
          deliveryRoute.name.includes(filterDto.name),
        ),
      );

      expect(deliveryRoutes.length).toBe(mockedDeliveryRoutes.length);
    });
  });

  describe('createDeliveryRoute', () => {
    it('should create one deliveryRoute', async () => {
      jest.spyOn(repository, 'createDeliveryRoute');

      const deliveryRoute: DeliveryRoute = await repository.createDeliveryRoute(
        CreateDeliveryRouteStub,
      );

      expect(repository.createDeliveryRoute).toBeCalledTimes(1);
      expect(deliveryRoute.constructor.name).toBe('DeliveryRoute');
      expect(await repository.count()).toBe(1);
    });
  });

  describe('updateDeliveryRoute', () => {
    it('should updated one deliveryRoute', async () => {
      jest.spyOn(repository, 'updateDeliveryRoute');

      const deliveryRoute: DeliveryRoute = await repository.createDeliveryRoute(
        CreateDeliveryRouteStub,
      );

      const updateDeliveryRouteDto: UpdateDeliveryRouteDto = {
        name: 'new name DeliveryRoute',
      };

      const updatedDeliveryRoute: DeliveryRoute =
        await repository.updateDeliveryRoute(
          deliveryRoute.id,
          updateDeliveryRouteDto,
        );

      expect(repository.updateDeliveryRoute).toBeCalledTimes(1);
      expect(updatedDeliveryRoute.constructor.name).toBe('DeliveryRoute');
      expect(updatedDeliveryRoute.name).toBe(updateDeliveryRouteDto.name);
    });
  });

  describe('deleteDeliveryRoute', () => {
    it('should delete one deliveryRoute', async () => {
      jest.spyOn(repository, 'softRemove');

      const deliveryRoute: DeliveryRoute = await repository.createDeliveryRoute(
        CreateDeliveryRouteStub,
      );

      await repository.softRemove(deliveryRoute);

      const getDeletedUser: DeliveryRoute = await repository.findOne({
        where: { id: deliveryRoute.id },
        withDeleted: true,
      });

      expect(repository.softRemove).toBeCalledTimes(1);
      expect(await repository.count()).toBe(0);
      expect(getDeletedUser.deletedAt).not.toBe(null);
    });
  });
});
