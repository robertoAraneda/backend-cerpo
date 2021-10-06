import { Test, TestingModule } from '@nestjs/testing';
import { CommuneService } from './commune.service';
import { Commune } from '../entities/commune.entity';
import { CommunesStub } from '../stubs/communes.stub';
import CreateCommuneStub from '../stubs/create-commune.stub';
import { NotFoundException } from '@nestjs/common';
import { CreateCommuneDto } from '../dto/create-commune.dto';
import { UpdateCommuneDto } from '../dto/update-commune.dto';
import { CommuneRepository } from '../repositories/commune.repository';
import { GetCommunesFilterDto } from '../dto/get-communes-filter.dto';
import { Region } from '../../region/entities/region.entity';

describe('CommunesService', () => {
  let service: CommuneService;
  let repository: CommuneRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommuneService, CommuneRepository],
    }).compile();

    service = module.get<CommuneService>(CommuneService);
    repository = module.get<CommuneRepository>(CommuneRepository);
  });

  it('should service be defined', () => {
    expect(service).toBeDefined();
  });

  it('should repository be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('GetCommunes', () => {
    it('should return and array of Communes', async () => {
      const result: Commune[] = CommunesStub.getAll();

      jest
        .spyOn(repository, 'getCommunes')
        .mockImplementation(async () => result);

      const filterDto: GetCommunesFilterDto = {
        name: 'Commune 1',
      };

      expect(await service.getCommunes(filterDto)).toBe(result);
      expect(repository.getCommunes).toHaveBeenCalled();
    });
  });

  describe('GetCommune', () => {
    it('should return a commune founded by id', async () => {
      const result: Commune = CommunesStub.getOne();

      jest.spyOn(repository, 'findOne').mockImplementation(async () => result);

      expect(await service.getCommuneById(result.code)).toBe(result);
      expect(repository.findOne).toHaveBeenCalled();
    });

    it("should throw an NotFoundHttpException if commune doesn't exist", async () => {
      const result: Commune = CommunesStub.getOne();

      jest
        .spyOn(repository, 'findOne')
        .mockImplementation(async () => undefined);

      try {
        await service.getCommuneById(result.code);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }

      expect(repository.findOne).toHaveBeenCalled();
    });
  });

  describe('CreateCommune', () => {
    it('should create one commune', async () => {
      const region: Region = undefined;
      const createCommuneDto: CreateCommuneDto = CreateCommuneStub(region, 1);
      const result: Commune = CommunesStub.getOne();

      jest
        .spyOn(repository, 'createCommune')
        .mockImplementation(async () => result);

      expect(await service.createCommune(createCommuneDto)).toBe(result);
      expect(repository.createCommune).toHaveBeenCalled();
    });
  });

  describe('UpdateCommune', () => {
    it('should update one commune', async () => {
      const commune: Commune = CommunesStub.getOne();

      const updateCommuneDto: UpdateCommuneDto = {
        name: 'New name Commune',
      };

      jest
        .spyOn(repository, 'updateCommune')
        .mockImplementation(async () => commune);

      expect(await service.updateCommune(commune.code, updateCommuneDto)).toBe(
        commune,
      );
      expect(repository.updateCommune).toHaveBeenCalled();
    });
  });

  describe('DeleteCommune', () => {
    it('should delete one commune', async () => {
      const commune: Commune = CommunesStub.getOne();

      jest
        .spyOn(repository, 'softRemove')
        .mockImplementation(async () => undefined);

      jest
        .spyOn(service, 'getCommuneById')
        .mockImplementation(async () => commune);

      expect(await service.removeCommune(commune.code)).toBe(undefined);
      expect(repository.softRemove).toHaveBeenCalledTimes(1);
      expect(service.getCommuneById).toHaveBeenCalledTimes(1);
    });
  });
});
