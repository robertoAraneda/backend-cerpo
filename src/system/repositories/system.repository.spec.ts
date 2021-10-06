import { SystemRepository } from './system.repository';
import { Connection } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { createMemDB } from '../../config/create-memory-database';
import { System } from '../entities/system.entity';
import { SystemsStub } from '../stubs/systems.stub';
import { GetSystemsFilterDto } from '../dto/get-systems-filter.dto';
import { UpdateSystemDto } from '../dto/update-system.dto';
import { CreateSystemStub } from '../stubs/create-system.stub';

describe('SystemsRepository', () => {
  let repository: SystemRepository;
  let db: Connection;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [],
    }).compile();
    db = await createMemDB();
    repository = db.getCustomRepository<SystemRepository>(SystemRepository);
  });

  afterEach(() => db.close());

  it('should repository be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('getSystems', () => {
    beforeEach(async () => {
      await Promise.all(
        SystemsStub.getAll().map(async (system) => {
          await repository.createSystem(system);
        }),
      );
    });

    it('should return and array of Systems', async () => {
      const mockedSystems: System[] = SystemsStub.getAll();
      jest.spyOn(repository, 'getSystems');

      const filterDto = {};

      const systems = await repository.find();

      expect(await repository.getSystems(filterDto)).toStrictEqual(systems);

      expect(systems.length).toBe(mockedSystems.length);
    });

    it('should return and array of filtered Systems', async () => {
      const mockedSystems: System[] = SystemsStub.getAll();

      jest.spyOn(repository, 'getSystems');

      const systems = await repository.find();

      const filterDto: GetSystemsFilterDto = {
        name: 'System 1',
      };

      expect(await repository.getSystems(filterDto)).toStrictEqual(
        [...systems].filter((system) => system.name.includes(filterDto.name)),
      );

      expect(systems.length).toBe(mockedSystems.length);
    });
  });

  describe('createSystem', () => {
    it('should create one system', async () => {
      jest.spyOn(repository, 'createSystem');

      const system: System = await repository.createSystem(CreateSystemStub);

      expect(repository.createSystem).toBeCalledTimes(1);
      expect(system.constructor.name).toBe('System');
      expect(await repository.count()).toBe(1);
    });
  });

  describe('updateSystem', () => {
    it('should updated one system', async () => {
      jest.spyOn(repository, 'updateSystem');

      const system: System = await repository.createSystem(CreateSystemStub);

      const updateSystemDto: UpdateSystemDto = {
        name: 'new name System',
      };

      const updatedSystem: System = await repository.updateSystem(
        system.id,
        updateSystemDto,
      );

      expect(repository.updateSystem).toBeCalledTimes(1);
      expect(updatedSystem.constructor.name).toBe('System');
      expect(updatedSystem.name).toBe(updateSystemDto.name);
    });
  });

  describe('deleteSystem', () => {
    it('should delete one system', async () => {
      jest.spyOn(repository, 'softRemove');

      const system: System = await repository.createSystem(CreateSystemStub);

      await repository.softRemove(system);

      const getDeletedUser: System = await repository.findOne({
        where: { id: system.id },
        withDeleted: true,
      });

      expect(repository.softRemove).toBeCalledTimes(1);
      expect(await repository.count()).toBe(0);
      expect(getDeletedUser.deletedAt).not.toBe(null);
    });
  });
});
