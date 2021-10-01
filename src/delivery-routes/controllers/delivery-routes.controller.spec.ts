import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryRoutesRepository } from '../repositories/delivery-routes.repository';
import { DeliveryRoute } from '../entities/delivery-route.entity';
import { DeliveryRoutesStub } from '../stubs/delivery-routes.stub';
import { UserAuthInterface } from '../../auth/interfaces/user-auth.interface';
import { CreateDeliveryRouteDto } from '../dto/create-delivery-route.dto';
import { CreateDeliveryRouteStub } from '../stubs/create-delivery-route.stub';
import { UpdateDeliveryRouteDto } from '../dto/update-delivery-route.dto';
import { DeliveryRoutesController } from './delivery-routes.controller';
import { DeliveryRoutesService } from '../services/delivery-routes.service';

describe('DeliveryRoutesController', () => {
  let controller: DeliveryRoutesController;
  let service: DeliveryRoutesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryRoutesController],
      providers: [DeliveryRoutesService, DeliveryRoutesRepository],
    }).compile();

    controller = module.get<DeliveryRoutesController>(DeliveryRoutesController);
    service = module.get<DeliveryRoutesService>(DeliveryRoutesService);
  });

  it('should controller be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should service be defined', () => {
    expect(service).toBeDefined();
  });

  describe('GetDeliveryRoutes', () => {
    it('should return and array of DeliveryRoutes', async () => {
      const result: DeliveryRoute[] = DeliveryRoutesStub.getAll();

      jest
        .spyOn(service, 'getDeliveryRoutes')
        .mockImplementation(async () => result);

      const user: UserAuthInterface = {
        id: '15654738-7',
        given: 'ROBERTO ALEJANDRO',
        fatherFamily: 'ARANEDA',
        motherFamily: 'ESPINOZA',
        role: 'admin',
      };
      const filterDto = {};

      expect(await controller.getDeliveryRoutes(user, filterDto)).toBe(result);
      expect(service.getDeliveryRoutes).toHaveBeenCalled();
    });
  });

  describe('CreateDeliveryRoute', () => {
    it('should create one deliveryRoute', async () => {
      const deliveryRoute: CreateDeliveryRouteDto = CreateDeliveryRouteStub;

      const result: DeliveryRoute = DeliveryRoutesStub.getOne();

      jest
        .spyOn(service, 'createDeliveryRoute')
        .mockImplementation(async () => result);

      expect(await controller.createDeliveryRoute(deliveryRoute)).toBe(result);
      expect(service.createDeliveryRoute).toHaveBeenCalled();
    });
  });

  describe('updateDeliveryRoute', () => {
    it('should update one deliveryRoute', async () => {
      const result: DeliveryRoute = DeliveryRoutesStub.getOne();

      const updated: UpdateDeliveryRouteDto = {
        name: 'NAME CHANGED',
      };

      jest
        .spyOn(service, 'updateDeliveryRoute')
        .mockImplementation(async () => result);

      expect(await controller.updateDeliveryRoute(result.id, updated)).toBe(
        result,
      );
      expect(service.updateDeliveryRoute).toHaveBeenCalled();
    });
  });

  describe('deleteDeliveryRoute', () => {
    it('should delete one deliveryRoute', async () => {
      const deliveryRoute: DeliveryRoute = DeliveryRoutesStub.getOne();

      const result: void = undefined;

      jest
        .spyOn(service, 'removeDeliveryRoute')
        .mockImplementation(async () => result);

      expect(await controller.removeDeliveryRoute(deliveryRoute.id));
      expect(service.removeDeliveryRoute).toHaveBeenCalled();
    });
  });
});
