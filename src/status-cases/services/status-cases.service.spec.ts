import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { StatusCasesService } from './status-cases.service';
import { StatusCase } from '../entities/status-case.entity';
import { StatusCasesStub } from '../stubs/status-cases.stub';
import { CreateStatusCaseStub } from '../stubs/create-status-case.stub';
import { CreateStatusCaseDto } from '../dto/create-status-case.dto';
import { UpdateStatusCaseDto } from '../dto/update-status-case.dto';
import { StatusCasesRepository } from '../repositories/status-cases.repository';
import { GetStatusCasesFilterDto } from '../dto/get-status-cases-filter.dto';

describe('StatusCasesService', () => {
  let service: StatusCasesService;
  let repository: StatusCasesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatusCasesService, StatusCasesRepository],
    }).compile();

    service = module.get<StatusCasesService>(StatusCasesService);
    repository = module.get<StatusCasesRepository>(StatusCasesRepository);
  });

  it('should service be defined', () => {
    expect(service).toBeDefined();
  });

  it('should repository be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('GetStatusCases', () => {
    it('should return and array of StatusCases', async () => {
      const result: StatusCase[] = StatusCasesStub.getAll();

      jest
        .spyOn(repository, 'getStatusCases')
        .mockImplementation(async () => result);

      const filterDto: GetStatusCasesFilterDto = {
        name: 'StatusCase 1',
      };

      expect(await service.getStatusCases(filterDto)).toBe(result);
      expect(repository.getStatusCases).toHaveBeenCalled();
    });
  });

  describe('GetStatusCase', () => {
    it('should return a statusCase founded by id', async () => {
      const result: StatusCase = StatusCasesStub.getOne();

      jest.spyOn(repository, 'findOne').mockImplementation(async () => result);

      expect(await service.getStatusCaseById(result.id)).toBe(result);
      expect(repository.findOne).toHaveBeenCalled();
    });

    it("should throw an NotFoundHttpException if statusCase doesn't exist", async () => {
      const result: StatusCase = StatusCasesStub.getOne();

      jest
        .spyOn(repository, 'findOne')
        .mockImplementation(async () => undefined);

      try {
        await service.getStatusCaseById(result.id);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }

      expect(repository.findOne).toHaveBeenCalled();
    });
  });

  describe('CreateStatusCase', () => {
    it('should create one statusCase', async () => {
      const createStatusCaseDto: CreateStatusCaseDto = CreateStatusCaseStub;
      const result: StatusCase = StatusCasesStub.getOne();

      jest
        .spyOn(repository, 'createStatusCase')
        .mockImplementation(async () => result);

      expect(await service.createStatusCase(createStatusCaseDto)).toBe(result);
      expect(repository.createStatusCase).toHaveBeenCalled();
    });
  });

  describe('UpdateStatusCase', () => {
    it('should update one statusCase', async () => {
      const statusCase: StatusCase = StatusCasesStub.getOne();

      const updateStatusCaseDto: UpdateStatusCaseDto = {
        name: 'New name StatusCase',
      };

      jest
        .spyOn(repository, 'updateStatusCase')
        .mockImplementation(async () => statusCase);

      expect(
        await service.updateStatusCase(statusCase.id, updateStatusCaseDto),
      ).toBe(statusCase);
      expect(repository.updateStatusCase).toHaveBeenCalled();
    });
  });

  describe('DeleteStatusCase', () => {
    it('should delete one statusCase', async () => {
      const statusCase: StatusCase = StatusCasesStub.getOne();

      jest
        .spyOn(repository, 'softRemove')
        .mockImplementation(async () => undefined);

      jest
        .spyOn(service, 'getStatusCaseById')
        .mockImplementation(async () => statusCase);

      expect(await service.removeStatusCase(statusCase.id)).toBe(undefined);
      expect(repository.softRemove).toHaveBeenCalledTimes(1);
      expect(service.getStatusCaseById).toHaveBeenCalledTimes(1);
    });
  });
});
