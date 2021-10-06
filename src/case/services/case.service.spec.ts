import { Test, TestingModule } from '@nestjs/testing';
import { CaseService } from './case.service';
import { Case } from '../entities/case.entity';
import { CasesStub } from '../stubs/cases.stub';
import CreateCaseStub from '../stubs/create-case.stub';
import { NotFoundException } from '@nestjs/common';
import { CreateCaseDto } from '../dto/create-case.dto';
import { UpdateCaseDto } from '../dto/update-case.dto';
import { CaseRepository } from '../repositories/case.repository';
import { GetCasesFilterDto } from '../dto/get-cases-filter.dto';
import { Patient } from '../../patient/entities/patient.entity';
import { CommitteeResult } from '../../committee-result/entities/committee-result.entity';
import { DeliveryRoute } from '../../delivery-route/entities/delivery-route.entity';
import { Organization } from '../../organization/entities/organization.entity';
import { User } from '../../user/entities/user.entity';
import { StatusCase } from '../../status-case/entities/status-case.entity';
import { System } from '../../system/entities/system.entity';

describe('CasesService', () => {
  let service: CaseService;
  let repository: CaseRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CaseService, CaseRepository],
    }).compile();

    service = module.get<CaseService>(CaseService);
    repository = module.get<CaseRepository>(CaseRepository);
  });

  it('should service be defined', () => {
    expect(service).toBeDefined();
  });

  it('should repository be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('GetCases', () => {
    it('should return and array of Cases', async () => {
      const result: Case[] = CasesStub.getAll();

      jest.spyOn(repository, 'getCases').mockImplementation(async () => result);

      const filterDto: GetCasesFilterDto = {
        title: 'Case 1',
      };

      expect(await service.getCases(filterDto)).toBe(result);
      expect(repository.getCases).toHaveBeenCalled();
    });
  });

  describe('GetCase', () => {
    it('should return a case founded by id', async () => {
      const result: Case = CasesStub.getOne();

      jest.spyOn(repository, 'findOne').mockImplementation(async () => result);

      expect(await service.getCaseById(result.id)).toBe(result);
      expect(repository.findOne).toHaveBeenCalled();
    });

    it("should throw an NotFoundHttpException if case doesn't exist", async () => {
      const result: Case = CasesStub.getOne();

      jest
        .spyOn(repository, 'findOne')
        .mockImplementation(async () => undefined);

      try {
        await service.getCaseById(result.id);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }

      expect(repository.findOne).toHaveBeenCalled();
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

      jest
        .spyOn(repository, 'createCase')
        .mockImplementation(async () => result);

      expect(await service.createCase(createCaseDto)).toBe(result);
      expect(repository.createCase).toHaveBeenCalled();
    });
  });

  describe('UpdateCase', () => {
    it('should update one case', async () => {
      const caseEntity: Case = CasesStub.getOne();

      const updateCaseDto: UpdateCaseDto = {
        title: 'New name Case',
      };

      jest
        .spyOn(repository, 'updateCase')
        .mockImplementation(async () => caseEntity);

      expect(await service.updateCase(caseEntity.id, updateCaseDto)).toBe(
        caseEntity,
      );
      expect(repository.updateCase).toHaveBeenCalled();
    });
  });

  describe('DeleteCase', () => {
    it('should delete one case', async () => {
      const caseEntity: Case = CasesStub.getOne();

      jest
        .spyOn(repository, 'softRemove')
        .mockImplementation(async () => undefined);

      jest
        .spyOn(service, 'getCaseById')
        .mockImplementation(async () => caseEntity);

      expect(await service.removeCase(caseEntity.id)).toBe(undefined);
      expect(repository.softRemove).toHaveBeenCalledTimes(1);
      expect(service.getCaseById).toHaveBeenCalledTimes(1);
    });
  });
});
