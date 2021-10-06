import { Test, TestingModule } from '@nestjs/testing';
import { CaseController } from './case.controller';
import { CaseService } from '../services/case.service';
import { Case } from '../entities/case.entity';
import { CasesStub } from '../stubs/cases.stub';
import { UserAuthInterface } from '../../auth/interfaces/user-auth.interface';
import { CreateCaseDto } from '../dto/create-case.dto';
import { UpdateCaseDto } from '../dto/update-case.dto';
import { CaseRepository } from '../repositories/case.repository';
import CreateCaseStub from '../stubs/create-case.stub';
import { Patient } from '../../patient/entities/patient.entity';
import { CommitteeResult } from '../../committee-result/entities/committee-result.entity';
import { DeliveryRoute } from '../../delivery-route/entities/delivery-route.entity';
import { Organization } from '../../organization/entities/organization.entity';
import { User } from '../../user/entities/user.entity';
import { StatusCase } from '../../status-case/entities/status-case.entity';
import { System } from '../../system/entities/system.entity';

describe('CasesController', () => {
  let controller: CaseController;
  let service: CaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CaseController],
      providers: [CaseService, CaseRepository],
    }).compile();

    controller = module.get<CaseController>(CaseController);
    service = module.get<CaseService>(CaseService);
  });

  it('should controller be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should service be defined', () => {
    expect(service).toBeDefined();
  });

  describe('GetCases', () => {
    it('should return and array of Cases', async () => {
      const result: Case[] = CasesStub.getAll();

      jest.spyOn(service, 'getCases').mockImplementation(async () => result);

      const user: UserAuthInterface = {
        id: '15654738-7',
        given: 'ROBERTO ALEJANDRO',
        fatherFamily: 'ARANEDA',
        motherFamily: 'ESPINOZA',
        role: 'admin',
      };
      const filterDto = {};

      expect(await controller.getCases(user, filterDto)).toBe(result);
      expect(service.getCases).toHaveBeenCalled();
    });
  });

  describe('CreateCase', () => {
    it('should create one case', async () => {
      const patient: Patient = undefined;
      const committeeResult: CommitteeResult = undefined;
      const deliveryRoute: DeliveryRoute = undefined;
      const organization: Organization = undefined;
      const practitioner: User = undefined;
      const statusCase: StatusCase = undefined;
      const system: System = undefined;

      const createCaseDto: CreateCaseDto = CreateCaseStub(
        patient,
        committeeResult,
        deliveryRoute,
        organization,
        practitioner,
        statusCase,
        system,
      );

      const result: Case = CasesStub.getOne();

      jest.spyOn(service, 'createCase').mockImplementation(async () => result);

      expect(await controller.createCase(createCaseDto)).toBe(result);
      expect(service.createCase).toHaveBeenCalled();
    });
  });

  describe('updateCase', () => {
    it('should update one case', async () => {
      const result: Case = CasesStub.getOne();

      const updated: UpdateCaseDto = {
        title: 'NAME CHANGED',
      };

      jest.spyOn(service, 'updateCase').mockImplementation(async () => result);

      expect(await controller.updateCase(result.id, updated)).toBe(result);
      expect(service.updateCase).toHaveBeenCalled();
    });
  });

  describe('deleteCase', () => {
    it('should delete one case', async () => {
      const caseEntity: Case = CasesStub.getOne();

      const result: void = undefined;

      jest.spyOn(service, 'removeCase').mockImplementation(async () => result);

      expect(await controller.removeCase(caseEntity.id));
      expect(service.removeCase).toHaveBeenCalled();
    });
  });
});
