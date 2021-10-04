import { StatusCaseRepository } from './status-case.repository';
import { Connection } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { createMemDB } from '../../config/create-memory-database';
import { StatusCase } from '../entities/status-case.entity';
import { StatusCasesStub } from '../stubs/status-cases.stub';
import { GetStatusCasesFilterDto } from '../dto/get-status-cases-filter.dto';
import { UpdateStatusCaseDto } from '../dto/update-status-case.dto';
import { CreateStatusCaseStub } from '../stubs/create-status-case.stub';

describe('StatusCasesRepository', () => {
  let repository: StatusCaseRepository;
  let db: Connection;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [],
    }).compile();
    db = await createMemDB([StatusCase]);
    repository = db.getCustomRepository<StatusCaseRepository>(
      StatusCaseRepository,
    );
  });

  afterEach(() => db.close());

  it('should repository be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('getStatusCases', () => {
    beforeEach(async () => {
      await Promise.all(
        StatusCasesStub.getAll().map(async (statusCase) => {
          await repository.createStatusCase(statusCase);
        }),
      );
    });

    it('should return and array of StatusCases', async () => {
      const mockedStatusCases: StatusCase[] = StatusCasesStub.getAll();
      jest.spyOn(repository, 'getStatusCases');

      const filterDto = {};

      const statusCases = await repository.find();

      expect(await repository.getStatusCases(filterDto)).toStrictEqual(
        statusCases,
      );

      expect(statusCases.length).toBe(mockedStatusCases.length);
    });

    it('should return and array of filtered StatusCases', async () => {
      const mockedStatusCases: StatusCase[] = StatusCasesStub.getAll();

      jest.spyOn(repository, 'getStatusCases');

      const statusCases = await repository.find();

      const filterDto: GetStatusCasesFilterDto = {
        name: 'StatusCase 1',
      };

      expect(await repository.getStatusCases(filterDto)).toStrictEqual(
        [...statusCases].filter((statusCase) =>
          statusCase.name.includes(filterDto.name),
        ),
      );

      expect(statusCases.length).toBe(mockedStatusCases.length);
    });
  });

  describe('createStatusCase', () => {
    it('should create one statusCase', async () => {
      jest.spyOn(repository, 'createStatusCase');

      const statusCase: StatusCase = await repository.createStatusCase(
        CreateStatusCaseStub,
      );

      expect(repository.createStatusCase).toBeCalledTimes(1);
      expect(statusCase.constructor.name).toBe('StatusCase');
      expect(await repository.count()).toBe(1);
    });
  });

  describe('updateStatusCase', () => {
    it('should updated one statusCase', async () => {
      jest.spyOn(repository, 'updateStatusCase');

      const statusCase: StatusCase = await repository.createStatusCase(
        CreateStatusCaseStub,
      );

      const updateStatusCaseDto: UpdateStatusCaseDto = {
        name: 'new name StatusCase',
      };

      const updatedStatusCase: StatusCase = await repository.updateStatusCase(
        statusCase.id,
        updateStatusCaseDto,
      );

      expect(repository.updateStatusCase).toBeCalledTimes(1);
      expect(updatedStatusCase.constructor.name).toBe('StatusCase');
      expect(updatedStatusCase.name).toBe(updateStatusCaseDto.name);
    });
  });

  describe('deleteStatusCase', () => {
    it('should delete one statusCase', async () => {
      jest.spyOn(repository, 'softRemove');

      const statusCase: StatusCase = await repository.createStatusCase(
        CreateStatusCaseStub,
      );

      await repository.softRemove(statusCase);

      const getDeletedUser: StatusCase = await repository.findOne({
        where: { id: statusCase.id },
        withDeleted: true,
      });

      expect(repository.softRemove).toBeCalledTimes(1);
      expect(await repository.count()).toBe(0);
      expect(getDeletedUser.deletedAt).not.toBe(null);
    });
  });
});
