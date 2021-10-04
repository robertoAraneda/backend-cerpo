import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DeliveryRouteService } from './delivery-route.service';
import { DeliveryRoute } from '../entities/delivery-route.entity';
import { DeliveryRoutesStub } from '../stubs/delivery-routes.stub';
import { CreateDeliveryRouteStub } from '../stubs/create-delivery-route.stub';
import { CreateDeliveryRouteDto } from '../dto/create-delivery-route.dto';
import { UpdateDeliveryRouteDto } from '../dto/update-delivery-route.dto';
import { DeliveryRouteRepository } from '../repositories/delivery-route.repository';
import { GetDeliveryRoutesFilterDto } from '../dto/get-delivery-routes-filter.dto';

describe('DeliveryRoutesService', () => {
  let service: DeliveryRouteService;
  let repository: DeliveryRouteRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeliveryRouteService, DeliveryRouteRepository],
    }).compile();

    service = module.get<DeliveryRouteService>(DeliveryRouteService);
    repository = module.get<DeliveryRouteRepository>(DeliveryRouteRepository);
  });

  it('should service be defined', () => {
    expect(service).toBeDefined();
  });

  it('should repository be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('GetDeliveryRoutes', () => {
    it('should return and array of DeliveryRoutes', async () => {
      const result: DeliveryRoute[] = DeliveryRoutesStub.getAll();

      jest
        .spyOn(repository, 'getDeliveryRoutes')
        .mockImplementation(async () => result);

      const filterDto: GetDeliveryRoutesFilterDto = {
        name: 'DeliveryRoute 1',
      };

      expect(await service.getDeliveryRoutes(filterDto)).toBe(result);
      expect(repository.getDeliveryRoutes).toHaveBeenCalled();
    });
  });

  describe('GetDeliveryRoute', () => {
    it('should return a deliveryRoute founded by id', async () => {
      const result: DeliveryRoute = DeliveryRoutesStub.getOne();

      jest.spyOn(repository, 'findOne').mockImplementation(async () => result);

      expect(await service.getDeliveryRouteById(result.id)).toBe(result);
      expect(repository.findOne).toHaveBeenCalled();
    });

    it("should throw an NotFoundHttpException if deliveryRoute doesn't exist", async () => {
      const result: DeliveryRoute = DeliveryRoutesStub.getOne();

      jest
        .spyOn(repository, 'findOne')
        .mockImplementation(async () => undefined);

      try {
        await service.getDeliveryRouteById(result.id);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }

      expect(repository.findOne).toHaveBeenCalled();
    });
  });

  describe('CreateDeliveryRoute', () => {
    it('should create one deliveryRoute', async () => {
      const createDeliveryRouteDto: CreateDeliveryRouteDto =
        CreateDeliveryRouteStub;
      const result: DeliveryRoute = DeliveryRoutesStub.getOne();

      jest
        .spyOn(repository, 'createDeliveryRoute')
        .mockImplementation(async () => result);

      expect(await service.createDeliveryRoute(createDeliveryRouteDto)).toBe(
        result,
      );
      expect(repository.createDeliveryRoute).toHaveBeenCalled();
    });
  });

  describe('UpdateDeliveryRoute', () => {
    it('should update one deliveryRoute', async () => {
      const deliveryRoute: DeliveryRoute = DeliveryRoutesStub.getOne();

      const updateDeliveryRouteDto: UpdateDeliveryRouteDto = {
        name: 'New name DeliveryRoute',
      };

      jest
        .spyOn(repository, 'updateDeliveryRoute')
        .mockImplementation(async () => deliveryRoute);

      expect(
        await service.updateDeliveryRoute(
          deliveryRoute.id,
          updateDeliveryRouteDto,
        ),
      ).toBe(deliveryRoute);
      expect(repository.updateDeliveryRoute).toHaveBeenCalled();
    });
  });

  describe('DeleteDeliveryRoute', () => {
    it('should delete one deliveryRoute', async () => {
      const deliveryRoute: DeliveryRoute = DeliveryRoutesStub.getOne();

      jest
        .spyOn(repository, 'softRemove')
        .mockImplementation(async () => undefined);

      jest
        .spyOn(service, 'getDeliveryRouteById')
        .mockImplementation(async () => deliveryRoute);

      expect(await service.removeDeliveryRoute(deliveryRoute.id)).toBe(
        undefined,
      );
      expect(repository.softRemove).toHaveBeenCalledTimes(1);
      expect(service.getDeliveryRouteById).toHaveBeenCalledTimes(1);
    });
  });
});
