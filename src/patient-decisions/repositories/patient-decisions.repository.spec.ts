import { PatientDecisionsRepository } from './patient-decisions.repository';
import { Connection } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { createMemDB } from '../../config/create-memory-database';
import { PatientDecision } from '../entities/patient-decision.entity';
import { PatientDecisionsStub } from '../stubs/patient-decisions.stub';
import { GetPatientDecisionsFilterDto } from '../dto/get-patient-decisions-filter.dto';
import { UpdatePatientDecisionDto } from '../dto/update-patient-decision.dto';
import { CreatePatientDecisionStub } from '../stubs/create-patient-decision.stub';

describe('PatientDecisionsRepository', () => {
  let repository: PatientDecisionsRepository;
  let db: Connection;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [],
    }).compile();
    db = await createMemDB([PatientDecision]);
    repository = db.getCustomRepository<PatientDecisionsRepository>(
      PatientDecisionsRepository,
    );
  });

  afterEach(() => db.close());

  it('should repository be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('getPatientDecisions', () => {
    beforeEach(async () => {
      await Promise.all(
        PatientDecisionsStub.getAll().map(async (patientDecision) => {
          await repository.createPatientDecision(patientDecision);
        }),
      );
    });

    it('should return and array of PatientDecisions', async () => {
      const mockedPatientDecisions: PatientDecision[] =
        PatientDecisionsStub.getAll();
      jest.spyOn(repository, 'getPatientDecisions');

      const filterDto = {};

      const patientDecisions = await repository.find();

      expect(await repository.getPatientDecisions(filterDto)).toStrictEqual(
        patientDecisions,
      );

      expect(patientDecisions.length).toBe(mockedPatientDecisions.length);
    });

    it('should return and array of filtered PatientDecisions', async () => {
      const mockedPatientDecisions: PatientDecision[] =
        PatientDecisionsStub.getAll();

      jest.spyOn(repository, 'getPatientDecisions');

      const patientDecisions = await repository.find();

      const filterDto: GetPatientDecisionsFilterDto = {
        name: 'PatientDecision 1',
      };

      expect(await repository.getPatientDecisions(filterDto)).toStrictEqual(
        [...patientDecisions].filter((patientDecision) =>
          patientDecision.name.includes(filterDto.name),
        ),
      );

      expect(patientDecisions.length).toBe(mockedPatientDecisions.length);
    });
  });

  describe('createPatientDecision', () => {
    it('should create one patientDecision', async () => {
      jest.spyOn(repository, 'createPatientDecision');

      const patientDecision: PatientDecision =
        await repository.createPatientDecision(CreatePatientDecisionStub);

      expect(repository.createPatientDecision).toBeCalledTimes(1);
      expect(patientDecision.constructor.name).toBe('PatientDecision');
      expect(await repository.count()).toBe(1);
    });
  });

  describe('updatePatientDecision', () => {
    it('should updated one patientDecision', async () => {
      jest.spyOn(repository, 'updatePatientDecision');

      const patientDecision: PatientDecision =
        await repository.createPatientDecision(CreatePatientDecisionStub);

      const updatePatientDecisionDto: UpdatePatientDecisionDto = {
        name: 'new name PatientDecision',
      };

      const updatedPatientDecision: PatientDecision =
        await repository.updatePatientDecision(
          patientDecision.id,
          updatePatientDecisionDto,
        );

      expect(repository.updatePatientDecision).toBeCalledTimes(1);
      expect(updatedPatientDecision.constructor.name).toBe('PatientDecision');
      expect(updatedPatientDecision.name).toBe(updatePatientDecisionDto.name);
    });
  });

  describe('deletePatientDecision', () => {
    it('should delete one patientDecision', async () => {
      jest.spyOn(repository, 'softRemove');

      const patientDecision: PatientDecision =
        await repository.createPatientDecision(CreatePatientDecisionStub);

      await repository.softRemove(patientDecision);

      const getDeletedUser: PatientDecision = await repository.findOne({
        where: { id: patientDecision.id },
        withDeleted: true,
      });

      expect(repository.softRemove).toBeCalledTimes(1);
      expect(await repository.count()).toBe(0);
      expect(getDeletedUser.deletedAt).not.toBe(null);
    });
  });
});
