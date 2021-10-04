import { Test, TestingModule } from '@nestjs/testing';
import { PatientDecisionRepository } from '../repositories/patient-decision.repository';
import { PatientDecision } from '../entities/patient-decision.entity';
import { PatientDecisionsStub } from '../stubs/patient-decisions.stub';
import { UserAuthInterface } from '../../auth/interfaces/user-auth.interface';
import { CreatePatientDecisionDto } from '../dto/create-patient-decision.dto';
import { CreatePatientDecisionStub } from '../stubs/create-patient-decision.stub';
import { UpdatePatientDecisionDto } from '../dto/update-patient-decision.dto';
import { PatientDecisionController } from './patient-decision.controller';
import { PatientDecisionService } from '../services/patient-decision.service';

describe('PatientDecisionsController', () => {
  let controller: PatientDecisionController;
  let service: PatientDecisionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientDecisionController],
      providers: [PatientDecisionService, PatientDecisionRepository],
    }).compile();

    controller = module.get<PatientDecisionController>(
      PatientDecisionController,
    );
    service = module.get<PatientDecisionService>(PatientDecisionService);
  });

  it('should controller be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should service be defined', () => {
    expect(service).toBeDefined();
  });

  describe('GetPatientDecisions', () => {
    it('should return and array of PatientDecisions', async () => {
      const result: PatientDecision[] = PatientDecisionsStub.getAll();

      jest
        .spyOn(service, 'getPatientDecisions')
        .mockImplementation(async () => result);

      const user: UserAuthInterface = {
        id: '15654738-7',
        given: 'ROBERTO ALEJANDRO',
        fatherFamily: 'ARANEDA',
        motherFamily: 'ESPINOZA',
        role: 'admin',
      };
      const filterDto = {};

      expect(await controller.getPatientDecisions(user, filterDto)).toBe(
        result,
      );
      expect(service.getPatientDecisions).toHaveBeenCalled();
    });
  });

  describe('CreatePatientDecision', () => {
    it('should create one patientDecision', async () => {
      const patientDecision: CreatePatientDecisionDto =
        CreatePatientDecisionStub;

      const result: PatientDecision = PatientDecisionsStub.getOne();

      jest
        .spyOn(service, 'createPatientDecision')
        .mockImplementation(async () => result);

      expect(await controller.createPatientDecision(patientDecision)).toBe(
        result,
      );
      expect(service.createPatientDecision).toHaveBeenCalled();
    });
  });

  describe('updatePatientDecision', () => {
    it('should update one patientDecision', async () => {
      const result: PatientDecision = PatientDecisionsStub.getOne();

      const updated: UpdatePatientDecisionDto = {
        name: 'NAME CHANGED',
      };

      jest
        .spyOn(service, 'updatePatientDecision')
        .mockImplementation(async () => result);

      expect(await controller.updatePatientDecision(result.id, updated)).toBe(
        result,
      );
      expect(service.updatePatientDecision).toHaveBeenCalled();
    });
  });

  describe('deletePatientDecision', () => {
    it('should delete one patientDecision', async () => {
      const patientDecision: PatientDecision = PatientDecisionsStub.getOne();

      const result: void = undefined;

      jest
        .spyOn(service, 'removePatientDecision')
        .mockImplementation(async () => result);

      expect(await controller.removePatientDecision(patientDecision.id));
      expect(service.removePatientDecision).toHaveBeenCalled();
    });
  });
});
