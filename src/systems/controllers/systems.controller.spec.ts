import { Test, TestingModule } from '@nestjs/testing';
import { SystemsController } from './systems.controller';
import { SystemsService } from '../services/systems.service';
import { System } from '../entities/system.entity';
import { SystemsStub } from '../stubs/systems.stub';
import { UserAuthInterface } from '../../auth/interfaces/user-auth.interface';
import { CreateSystemDto } from '../dto/create-system.dto';
import { UpdateSystemDto } from '../dto/update-system.dto';
import { SystemsRepository } from '../repositories/systems.repository';
import { CreateSystemStub } from '../stubs/create-system.stub';

describe('SystemsController', () => {
  let controller: SystemsController;
  let service: SystemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SystemsController],
      providers: [SystemsService, SystemsRepository],
    }).compile();

    controller = module.get<SystemsController>(SystemsController);
    service = module.get<SystemsService>(SystemsService);
  });

  it('should controller be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should service be defined', () => {
    expect(service).toBeDefined();
  });

  describe('GetSystems', () => {
    it('should return and array of Systems', async () => {
      const result: System[] = SystemsStub.getAll();

      jest.spyOn(service, 'getSystems').mockImplementation(async () => result);

      const user: UserAuthInterface = {
        id: '15654738-7',
        given: 'ROBERTO ALEJANDRO',
        fatherFamily: 'ARANEDA',
        motherFamily: 'ESPINOZA',
        role: 'admin',
      };
      const filterDto = {};

      expect(await controller.getSystems(user, filterDto)).toBe(result);
      expect(service.getSystems).toHaveBeenCalled();
    });
  });

  describe('CreateSystem', () => {
    it('should create one system', async () => {
      const system: CreateSystemDto = CreateSystemStub;

      const result: System = SystemsStub.getOne();

      jest
        .spyOn(service, 'createSystem')
        .mockImplementation(async () => result);

      expect(await controller.createSystem(system)).toBe(result);
      expect(service.createSystem).toHaveBeenCalled();
    });
  });

  describe('updateSystem', () => {
    it('should update one system', async () => {
      const result: System = SystemsStub.getOne();

      const updated: UpdateSystemDto = {
        name: 'NAME CHANGED',
      };

      jest
        .spyOn(service, 'updateSystem')
        .mockImplementation(async () => result);

      expect(await controller.updateSystem(result.id, updated)).toBe(result);
      expect(service.updateSystem).toHaveBeenCalled();
    });
  });

  describe('deleteSystem', () => {
    it('should delete one system', async () => {
      const system: System = SystemsStub.getOne();

      const result: void = undefined;

      jest
        .spyOn(service, 'removeSystem')
        .mockImplementation(async () => result);

      expect(await controller.removeSystem(system.id));
      expect(service.removeSystem).toHaveBeenCalled();
    });
  });
});
