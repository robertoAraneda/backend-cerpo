import { Test, TestingModule } from '@nestjs/testing';
import { RegionsService } from './regions.service';
import { Region } from '../entities/region.entity';
import { RegionsStub } from '../stubs/regions.stub';
import { CreateRegionStub } from '../stubs/create-region.stub';
import { NotFoundException } from '@nestjs/common';
import { CreateRegionDto } from '../dto/create-region.dto';
import { UpdateRegionDto } from '../dto/update-region.dto';
import { RegionsRepository } from '../repositories/regions.repository';
import { GetRegionsFilterDto } from '../dto/get-regions-filter.dto';

describe('RegionsService', () => {
  let service: RegionsService;
  let repository: RegionsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegionsService, RegionsRepository],
    }).compile();

    service = module.get<RegionsService>(RegionsService);
    repository = module.get<RegionsRepository>(RegionsRepository);
  });

  it('should service be defined', () => {
    expect(service).toBeDefined();
  });

  it('should repository be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('GetRegions', () => {
    it('should return and array of Regions', async () => {
      const result: Region[] = RegionsStub.getAll();

      jest
        .spyOn(repository, 'getRegions')
        .mockImplementation(async () => result);

      const filterDto: GetRegionsFilterDto = {
        name: 'Region 1',
      };

      expect(await service.getRegions(filterDto)).toBe(result);
      expect(repository.getRegions).toHaveBeenCalled();
    });
  });

  describe('GetRegion', () => {
    it('should return a region founded by id', async () => {
      const result: Region = RegionsStub.getOne();

      jest.spyOn(repository, 'findOne').mockImplementation(async () => result);

      expect(await service.getRegionById(result.id)).toBe(result);
      expect(repository.findOne).toHaveBeenCalled();
    });

    it("should throw an NotFoundHttpException if region doesn't exist", async () => {
      const result: Region = RegionsStub.getOne();

      jest
        .spyOn(repository, 'findOne')
        .mockImplementation(async () => undefined);

      try {
        await service.getRegionById(result.id);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }

      expect(repository.findOne).toHaveBeenCalled();
    });
  });

  describe('CreateRegion', () => {
    it('should create one region', async () => {
      const createRegionDto: CreateRegionDto = CreateRegionStub;
      const result: Region = RegionsStub.getOne();

      jest
        .spyOn(repository, 'createRegion')
        .mockImplementation(async () => result);

      expect(await service.createRegion(createRegionDto)).toBe(result);
      expect(repository.createRegion).toHaveBeenCalled();
    });
  });

  describe('UpdateRegion', () => {
    it('should update one region', async () => {
      const region: Region = RegionsStub.getOne();

      const updateRegionDto: UpdateRegionDto = {
        name: 'New name Region',
      };

      jest
        .spyOn(repository, 'updateRegion')
        .mockImplementation(async () => region);

      expect(await service.updateRegion(region.id, updateRegionDto)).toBe(
        region,
      );
      expect(repository.updateRegion).toHaveBeenCalled();
    });
  });

  describe('DeleteRegion', () => {
    it('should delete one region', async () => {
      const region: Region = RegionsStub.getOne();

      jest
        .spyOn(repository, 'softRemove')
        .mockImplementation(async () => undefined);

      jest
        .spyOn(service, 'getRegionById')
        .mockImplementation(async () => region);

      expect(await service.removeRegion(region.id)).toBe(undefined);
      expect(repository.softRemove).toHaveBeenCalledTimes(1);
      expect(service.getRegionById).toHaveBeenCalledTimes(1);
    });
  });
});
