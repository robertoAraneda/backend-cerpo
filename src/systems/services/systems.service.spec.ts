import { Test, TestingModule } from '@nestjs/testing';
import { SystemsService } from './systems.service';
import { System } from '../entities/system.entity';
import { SystemsStub } from '../stubs/systems.stub';
import { CreateSystemStub } from '../stubs/create-system.stub';
import { NotFoundException } from '@nestjs/common';
import { CreateSystemDto } from '../dto/create-system.dto';
import { UpdateSystemDto } from '../dto/update-system.dto';
import { SystemsRepository } from '../repositories/systems.repository';
import { GetSystemsFilterDto } from '../dto/get-systems-filter.dto';

describe('SystemsService', () => {
  let service: SystemsService;
  let repository: SystemsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SystemsService, SystemsRepository],
    }).compile();

    service = module.get<SystemsService>(SystemsService);
    repository = module.get<SystemsRepository>(SystemsRepository);
  });

  it('should service be defined', () => {
    expect(service).toBeDefined();
  });

  it('should repository be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('GetSystems', () => {
    it('should return and array of Systems', async () => {
      const result: System[] = SystemsStub.getAll();

      jest
        .spyOn(repository, 'getSystems')
        .mockImplementation(async () => result);

      const filterDto: GetSystemsFilterDto = {
        name: 'System 1',
      };

      expect(await service.getSystems(filterDto)).toBe(result);
      expect(repository.getSystems).toHaveBeenCalled();
    });
  });

  describe('GetSystem', () => {
    it('should return a system founded by id', async () => {
      const result: System = SystemsStub.getOne();

      jest.spyOn(repository, 'findOne').mockImplementation(async () => result);

      expect(await service.getSystemById(result.id)).toBe(result);
      expect(repository.findOne).toHaveBeenCalled();
    });

    it("should throw an NotFoundHttpException if system doesn't exist", async () => {
      const result: System = SystemsStub.getOne();

      jest
        .spyOn(repository, 'findOne')
        .mockImplementation(async () => undefined);

      try {
        await service.getSystemById(result.id);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }

      expect(repository.findOne).toHaveBeenCalled();
    });
  });

  describe('CreateSystem', () => {
    it('should create one system', async () => {
      const createSystemDto: CreateSystemDto = CreateSystemStub;
      const result: System = SystemsStub.getOne();

      jest
        .spyOn(repository, 'createSystem')
        .mockImplementation(async () => result);

      expect(await service.createSystem(createSystemDto)).toBe(result);
      expect(repository.createSystem).toHaveBeenCalled();
    });
  });

  describe('UpdateSystem', () => {
    it('should update one system', async () => {
      const system: System = SystemsStub.getOne();

      const updateSystemDto: UpdateSystemDto = {
        name: 'New name System',
      };

      jest
        .spyOn(repository, 'updateSystem')
        .mockImplementation(async () => system);

      expect(await service.updateSystem(system.id, updateSystemDto)).toBe(
        system,
      );
      expect(repository.updateSystem).toHaveBeenCalled();
    });
  });

  describe('DeleteSystem', () => {
    it('should delete one system', async () => {
      const system: System = SystemsStub.getOne();

      jest
        .spyOn(repository, 'softRemove')
        .mockImplementation(async () => undefined);

      jest
        .spyOn(service, 'getSystemById')
        .mockImplementation(async () => system);

      expect(await service.removeSystem(system.id)).toBe(undefined);
      expect(repository.softRemove).toHaveBeenCalledTimes(1);
      expect(service.getSystemById).toHaveBeenCalledTimes(1);
    });
  });
});
