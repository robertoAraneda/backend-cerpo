import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PatientDecisionsService } from './patient-decisions.service';
import { PatientDecision } from '../entities/patient-decision.entity';
import { PatientDecisionsStub } from '../stubs/patient-decisions.stub';
import { CreatePatientDecisionStub } from '../stubs/create-patient-decision.stub';
import { CreatePatientDecisionDto } from '../dto/create-patient-decision.dto';
import { UpdatePatientDecisionDto } from '../dto/update-patient-decision.dto';
import { PatientDecisionsRepository } from '../repositories/patient-decisions.repository';
import { GetPatientDecisionsFilterDto } from '../dto/get-patient-decisions-filter.dto';

describe('PatientDecisionsService', () => {
  let service: PatientDecisionsService;
  let repository: PatientDecisionsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PatientDecisionsService, PatientDecisionsRepository],
    }).compile();

    service = module.get<PatientDecisionsService>(PatientDecisionsService);
    repository = module.get<PatientDecisionsRepository>(
      PatientDecisionsRepository,
    );
  });

  it('should service be defined', () => {
    expect(service).toBeDefined();
  });

  it('should repository be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('GetPatientDecisions', () => {
    it('should return and array of PatientDecisions', async () => {
      const result: PatientDecision[] = PatientDecisionsStub.getAll();

      jest
        .spyOn(repository, 'getPatientDecisions')
        .mockImplementation(async () => result);

      const filterDto: GetPatientDecisionsFilterDto = {
        name: 'PatientDecision 1',
      };

      expect(await service.getPatientDecisions(filterDto)).toBe(result);
      expect(repository.getPatientDecisions).toHaveBeenCalled();
    });
  });

  describe('GetPatientDecision', () => {
    it('should return a patientDecision founded by id', async () => {
      const result: PatientDecision = PatientDecisionsStub.getOne();

      jest.spyOn(repository, 'findOne').mockImplementation(async () => result);

      expect(await service.getPatientDecisionById(result.id)).toBe(result);
      expect(repository.findOne).toHaveBeenCalled();
    });

    it("should throw an NotFoundHttpException if patientDecision doesn't exist", async () => {
      const result: PatientDecision = PatientDecisionsStub.getOne();

      jest
        .spyOn(repository, 'findOne')
        .mockImplementation(async () => undefined);

      try {
        await service.getPatientDecisionById(result.id);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }

      expect(repository.findOne).toHaveBeenCalled();
    });
  });

  describe('CreatePatientDecision', () => {
    it('should create one patientDecision', async () => {
      const createPatientDecisionDto: CreatePatientDecisionDto =
        CreatePatientDecisionStub;
      const result: PatientDecision = PatientDecisionsStub.getOne();

      jest
        .spyOn(repository, 'createPatientDecision')
        .mockImplementation(async () => result);

      expect(
        await service.createPatientDecision(createPatientDecisionDto),
      ).toBe(result);
      expect(repository.createPatientDecision).toHaveBeenCalled();
    });
  });

  describe('UpdatePatientDecision', () => {
    it('should update one patientDecision', async () => {
      const patientDecision: PatientDecision = PatientDecisionsStub.getOne();

      const updatePatientDecisionDto: UpdatePatientDecisionDto = {
        name: 'New name PatientDecision',
      };

      jest
        .spyOn(repository, 'updatePatientDecision')
        .mockImplementation(async () => patientDecision);

      expect(
        await service.updatePatientDecision(
          patientDecision.id,
          updatePatientDecisionDto,
        ),
      ).toBe(patientDecision);
      expect(repository.updatePatientDecision).toHaveBeenCalled();
    });
  });

  describe('DeletePatientDecision', () => {
    it('should delete one patientDecision', async () => {
      const patientDecision: PatientDecision = PatientDecisionsStub.getOne();

      jest
        .spyOn(repository, 'softRemove')
        .mockImplementation(async () => undefined);

      jest
        .spyOn(service, 'getPatientDecisionById')
        .mockImplementation(async () => patientDecision);

      expect(await service.removePatientDecision(patientDecision.id)).toBe(
        undefined,
      );
      expect(repository.softRemove).toHaveBeenCalledTimes(1);
      expect(service.getPatientDecisionById).toHaveBeenCalledTimes(1);
    });
  });
});
