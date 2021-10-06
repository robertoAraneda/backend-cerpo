import { RegionRepository } from './region.repository';
import { Connection } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { createMemDB } from '../../config/create-memory-database';
import { Region } from '../entities/region.entity';
import { RegionsStub } from '../stubs/regions.stub';
import { GetRegionsFilterDto } from '../dto/get-regions-filter.dto';
import { UpdateRegionDto } from '../dto/update-region.dto';
import { CreateRegionStub } from '../stubs/create-region.stub';

describe('RegionsRepository', () => {
  let repository: RegionRepository;
  let db: Connection;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [],
    }).compile();
    db = await createMemDB();
    repository = db.getCustomRepository<RegionRepository>(RegionRepository);
  });

  afterEach(() => db.close());

  it('should repository be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('getRegions', () => {
    beforeEach(async () => {
      await Promise.all(
        RegionsStub.getAll().map(async (region) => {
          await repository.createRegion(region);
        }),
      );
    });

    it('should return and array of Regions', async () => {
      const mockedRegions: Region[] = RegionsStub.getAll();
      jest.spyOn(repository, 'getRegions');

      const filterDto = {};

      const regions = await repository.find();

      expect(await repository.getRegions(filterDto)).toStrictEqual(regions);

      expect(regions.length).toBe(mockedRegions.length);
    });

    it('should return and array of filtered Regions', async () => {
      const mockedRegions: Region[] = RegionsStub.getAll();

      jest.spyOn(repository, 'getRegions');

      const regions = await repository.find();

      const filterDto: GetRegionsFilterDto = {
        name: 'Region 1',
      };

      expect(await repository.getRegions(filterDto)).toStrictEqual(
        [...regions].filter((region) => region.name.includes(filterDto.name)),
      );

      expect(regions.length).toBe(mockedRegions.length);
    });
  });

  describe('createRegion', () => {
    it('should create one region', async () => {
      jest.spyOn(repository, 'createRegion');

      const region: Region = await repository.createRegion(CreateRegionStub);

      expect(repository.createRegion).toBeCalledTimes(1);
      expect(region.constructor.name).toBe('Region');
      expect(await repository.count()).toBe(1);
    });
  });

  describe('updateRegion', () => {
    it('should updated one region', async () => {
      jest.spyOn(repository, 'updateRegion');

      const region: Region = await repository.createRegion(CreateRegionStub);

      const updateRegionDto: UpdateRegionDto = {
        name: 'new name Region',
      };

      const updatedRegion: Region = await repository.updateRegion(
        region.code,
        updateRegionDto,
      );

      expect(repository.updateRegion).toBeCalledTimes(1);
      expect(updatedRegion.constructor.name).toBe('Region');
      expect(updatedRegion.name).toBe(updateRegionDto.name);
    });
  });

  describe('deleteRegion', () => {
    it('should delete one region', async () => {
      jest.spyOn(repository, 'softRemove');

      const region: Region = await repository.createRegion(CreateRegionStub);

      await repository.softRemove(region);

      const getDeletedUser: Region = await repository.findOne({
        where: { code: region.code },
        withDeleted: true,
      });

      expect(repository.softRemove).toBeCalledTimes(1);
      expect(await repository.count()).toBe(0);
      expect(getDeletedUser.deletedAt).not.toBe(null);
    });
  });
});
