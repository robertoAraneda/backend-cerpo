import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CommitteeResultService } from './committee-result.service';
import { CommitteeResult } from '../entities/committee-result.entity';
import { CommitteeResultsStub } from '../stubs/committee-results.stub';
import { CreateCommitteeResultStub } from '../stubs/create-committee-result.stub';
import { CreateCommitteeResultDto } from '../dto/create-committee-result.dto';
import { UpdateCommitteeResultDto } from '../dto/update-committee-result.dto';
import { CommitteeResultRepository } from '../repositories/committee-result.repository';
import { GetCommitteeResultsFilterDto } from '../dto/get-committee-results-filter.dto';

describe('CommitteeResultsService', () => {
  let service: CommitteeResultService;
  let repository: CommitteeResultRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommitteeResultService, CommitteeResultRepository],
    }).compile();

    service = module.get<CommitteeResultService>(CommitteeResultService);
    repository = module.get<CommitteeResultRepository>(
      CommitteeResultRepository,
    );
  });

  it('should service be defined', () => {
    expect(service).toBeDefined();
  });

  it('should repository be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('GetCommitteeResults', () => {
    it('should return and array of CommitteeResults', async () => {
      const result: CommitteeResult[] = CommitteeResultsStub.getAll();

      jest
        .spyOn(repository, 'getCommitteeResults')
        .mockImplementation(async () => result);

      const filterDto: GetCommitteeResultsFilterDto = {
        name: 'CommitteeResult 1',
      };

      expect(await service.getCommitteeResults(filterDto)).toBe(result);
      expect(repository.getCommitteeResults).toHaveBeenCalled();
    });
  });

  describe('GetCommitteeResult', () => {
    it('should return a committeeResult founded by id', async () => {
      const result: CommitteeResult = CommitteeResultsStub.getOne();

      jest.spyOn(repository, 'findOne').mockImplementation(async () => result);

      expect(await service.getCommitteeResultById(result.id)).toBe(result);
      expect(repository.findOne).toHaveBeenCalled();
    });

    it("should throw an NotFoundHttpException if committeeResult doesn't exist", async () => {
      const result: CommitteeResult = CommitteeResultsStub.getOne();

      jest
        .spyOn(repository, 'findOne')
        .mockImplementation(async () => undefined);

      try {
        await service.getCommitteeResultById(result.id);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }

      expect(repository.findOne).toHaveBeenCalled();
    });
  });

  describe('CreateCommitteeResult', () => {
    it('should create one committeeResult', async () => {
      const createCommitteeResultDto: CreateCommitteeResultDto =
        CreateCommitteeResultStub;
      const result: CommitteeResult = CommitteeResultsStub.getOne();

      jest
        .spyOn(repository, 'createCommitteeResult')
        .mockImplementation(async () => result);

      expect(
        await service.createCommitteeResult(createCommitteeResultDto),
      ).toBe(result);
      expect(repository.createCommitteeResult).toHaveBeenCalled();
    });
  });

  describe('UpdateCommitteeResult', () => {
    it('should update one committeeResult', async () => {
      const committeeResult: CommitteeResult = CommitteeResultsStub.getOne();

      const updateCommitteeResultDto: UpdateCommitteeResultDto = {
        name: 'New name CommitteeResult',
      };

      jest
        .spyOn(repository, 'updateCommitteeResult')
        .mockImplementation(async () => committeeResult);

      expect(
        await service.updateCommitteeResult(
          committeeResult.id,
          updateCommitteeResultDto,
        ),
      ).toBe(committeeResult);
      expect(repository.updateCommitteeResult).toHaveBeenCalled();
    });
  });

  describe('DeleteCommitteeResult', () => {
    it('should delete one committeeResult', async () => {
      const committeeResult: CommitteeResult = CommitteeResultsStub.getOne();

      jest
        .spyOn(repository, 'softRemove')
        .mockImplementation(async () => undefined);

      jest
        .spyOn(service, 'getCommitteeResultById')
        .mockImplementation(async () => committeeResult);

      expect(await service.removeCommitteeResult(committeeResult.id)).toBe(
        undefined,
      );
      expect(repository.softRemove).toHaveBeenCalledTimes(1);
      expect(service.getCommitteeResultById).toHaveBeenCalledTimes(1);
    });
  });
});
