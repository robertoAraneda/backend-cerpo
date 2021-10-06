import { CommitteeResultRepository } from './committee-result.repository';
import { Connection } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { createMemDB } from '../../config/create-memory-database';
import { CommitteeResult } from '../entities/committee-result.entity';
import { CommitteeResultsStub } from '../stubs/committee-results.stub';
import { GetCommitteeResultsFilterDto } from '../dto/get-committee-results-filter.dto';
import { UpdateCommitteeResultDto } from '../dto/update-committee-result.dto';
import { CreateCommitteeResultStub } from '../stubs/create-committee-result.stub';
import { Case } from '../../case/entities/case.entity';
import { Patient } from '../../patient/entities/patient.entity';
import { System } from '../../system/entities/system.entity';
import { Organization } from '../../organization/entities/organization.entity';
import { User } from '../../user/entities/user.entity';
import { DeliveryRoute } from '../../delivery-route/entities/delivery-route.entity';
import { StatusCase } from '../../status-case/entities/status-case.entity';

describe('CommitteeResultsRepository', () => {
  let repository: CommitteeResultRepository;
  let db: Connection;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [],
    }).compile();
    db = await createMemDB();
    repository = db.getCustomRepository<CommitteeResultRepository>(
      CommitteeResultRepository,
    );
  });

  afterEach(() => db.close());

  it('should repository be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('getCommitteeResults', () => {
    beforeEach(async () => {
      await Promise.all(
        CommitteeResultsStub.getAll().map(async (committeeResult) => {
          await repository.createCommitteeResult(committeeResult);
        }),
      );
    });

    it('should return and array of CommitteeResults', async () => {
      const mockedCommitteeResults: CommitteeResult[] =
        CommitteeResultsStub.getAll();
      jest.spyOn(repository, 'getCommitteeResults');

      const filterDto = {};

      const committeeResults = await repository.find();

      expect(await repository.getCommitteeResults(filterDto)).toStrictEqual(
        committeeResults,
      );

      expect(committeeResults.length).toBe(mockedCommitteeResults.length);
    });

    it('should return and array of filtered CommitteeResults', async () => {
      const mockedCommitteeResults: CommitteeResult[] =
        CommitteeResultsStub.getAll();

      jest.spyOn(repository, 'getCommitteeResults');

      const committeeResults = await repository.find();

      const filterDto: GetCommitteeResultsFilterDto = {
        name: 'CommitteeResult 1',
      };

      expect(await repository.getCommitteeResults(filterDto)).toStrictEqual(
        [...committeeResults].filter((committeeResult) =>
          committeeResult.name.includes(filterDto.name),
        ),
      );

      expect(committeeResults.length).toBe(mockedCommitteeResults.length);
    });
  });

  describe('createCommitteeResult', () => {
    it('should create one committeeResult', async () => {
      jest.spyOn(repository, 'createCommitteeResult');

      const committeeResult: CommitteeResult =
        await repository.createCommitteeResult(CreateCommitteeResultStub);

      expect(repository.createCommitteeResult).toBeCalledTimes(1);
      expect(committeeResult.constructor.name).toBe('CommitteeResult');
      expect(await repository.count()).toBe(1);
    });
  });

  describe('updateCommitteeResult', () => {
    it('should updated one committeeResult', async () => {
      jest.spyOn(repository, 'updateCommitteeResult');

      const committeeResult: CommitteeResult =
        await repository.createCommitteeResult(CreateCommitteeResultStub);

      const updateCommitteeResultDto: UpdateCommitteeResultDto = {
        name: 'new name CommitteeResult',
      };

      const updatedCommitteeResult: CommitteeResult =
        await repository.updateCommitteeResult(
          committeeResult.id,
          updateCommitteeResultDto,
        );

      expect(repository.updateCommitteeResult).toBeCalledTimes(1);
      expect(updatedCommitteeResult.constructor.name).toBe('CommitteeResult');
      expect(updatedCommitteeResult.name).toBe(updateCommitteeResultDto.name);
    });
  });

  describe('deleteCommitteeResult', () => {
    it('should delete one committeeResult', async () => {
      jest.spyOn(repository, 'softRemove');

      const committeeResult: CommitteeResult =
        await repository.createCommitteeResult(CreateCommitteeResultStub);

      await repository.softRemove(committeeResult);

      const getDeletedUser: CommitteeResult = await repository.findOne({
        where: { id: committeeResult.id },
        withDeleted: true,
      });

      expect(repository.softRemove).toBeCalledTimes(1);
      expect(await repository.count()).toBe(0);
      expect(getDeletedUser.deletedAt).not.toBe(null);
    });
  });
});
