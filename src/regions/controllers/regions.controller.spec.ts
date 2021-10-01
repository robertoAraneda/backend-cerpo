import { Test, TestingModule } from '@nestjs/testing';
import { RegionsController } from './regions.controller';
import { RegionsService } from '../services/regions.service';
import { Region } from '../entities/region.entity';
import { RegionsStub } from '../stubs/regions.stub';
import { UserAuthInterface } from '../../auth/interfaces/user-auth.interface';
import { CreateRegionDto } from '../dto/create-region.dto';
import { UpdateRegionDto } from '../dto/update-region.dto';
import { RegionsRepository } from '../repositories/regions.repository';
import { CreateRegionStub } from '../stubs/create-region.stub';

describe('RegionsController', () => {
  let controller: RegionsController;
  let service: RegionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegionsController],
      providers: [RegionsService, RegionsRepository],
    }).compile();

    controller = module.get<RegionsController>(RegionsController);
    service = module.get<RegionsService>(RegionsService);
  });

  it('should controller be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should service be defined', () => {
    expect(service).toBeDefined();
  });

  describe('GetRegions', () => {
    it('should return and array of Regions', async () => {
      const result: Region[] = RegionsStub.getAll();

      jest.spyOn(service, 'getRegions').mockImplementation(async () => result);

      const user: UserAuthInterface = {
        id: '15654738-7',
        given: 'ROBERTO ALEJANDRO',
        fatherFamily: 'ARANEDA',
        motherFamily: 'ESPINOZA',
        role: 'admin',
      };
      const filterDto = {};

      expect(await controller.getRegions(user, filterDto)).toBe(result);
      expect(service.getRegions).toHaveBeenCalled();
    });
  });

  describe('CreateRegion', () => {
    it('should create one region', async () => {
      const region: CreateRegionDto = CreateRegionStub;

      const result: Region = RegionsStub.getOne();

      jest
        .spyOn(service, 'createRegion')
        .mockImplementation(async () => result);

      expect(await controller.createRegion(region)).toBe(result);
      expect(service.createRegion).toHaveBeenCalled();
    });
  });

  describe('updateRegion', () => {
    it('should update one region', async () => {
      const result: Region = RegionsStub.getOne();

      const updated: UpdateRegionDto = {
        name: 'NAME CHANGED',
      };

      jest
        .spyOn(service, 'updateRegion')
        .mockImplementation(async () => result);

      expect(await controller.updateRegion(result.id, updated)).toBe(result);
      expect(service.updateRegion).toHaveBeenCalled();
    });
  });

  describe('deleteRegion', () => {
    it('should delete one region', async () => {
      const region: Region = RegionsStub.getOne();

      const result: void = undefined;

      jest
        .spyOn(service, 'removeRegion')
        .mockImplementation(async () => result);

      expect(await controller.removeRegion(region.id));
      expect(service.removeRegion).toHaveBeenCalled();
    });
  });
});
