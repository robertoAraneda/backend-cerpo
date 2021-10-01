import { Test, TestingModule } from '@nestjs/testing';
import { StatusCasesRepository } from '../repositories/status-cases.repository';
import { StatusCase } from '../entities/status-case.entity';
import { StatusCasesStub } from '../stubs/status-cases.stub';
import { UserAuthInterface } from '../../auth/interfaces/user-auth.interface';
import { CreateStatusCaseDto } from '../dto/create-status-case.dto';
import { CreateStatusCaseStub } from '../stubs/create-status-case.stub';
import { UpdateStatusCaseDto } from '../dto/update-status-case.dto';
import { StatusCasesController } from './status-cases.controller';
import { StatusCasesService } from '../services/status-cases.service';

describe('StatusCasesController', () => {
  let controller: StatusCasesController;
  let service: StatusCasesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatusCasesController],
      providers: [StatusCasesService, StatusCasesRepository],
    }).compile();

    controller = module.get<StatusCasesController>(StatusCasesController);
    service = module.get<StatusCasesService>(StatusCasesService);
  });

  it('should controller be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should service be defined', () => {
    expect(service).toBeDefined();
  });

  describe('GetStatusCases', () => {
    it('should return and array of StatusCases', async () => {
      const result: StatusCase[] = StatusCasesStub.getAll();

      jest
        .spyOn(service, 'getStatusCases')
        .mockImplementation(async () => result);

      const user: UserAuthInterface = {
        id: '15654738-7',
        given: 'ROBERTO ALEJANDRO',
        fatherFamily: 'ARANEDA',
        motherFamily: 'ESPINOZA',
        role: 'admin',
      };
      const filterDto = {};

      expect(await controller.getStatusCases(user, filterDto)).toBe(result);
      expect(service.getStatusCases).toHaveBeenCalled();
    });
  });

  describe('CreateStatusCase', () => {
    it('should create one statusCase', async () => {
      const statusCase: CreateStatusCaseDto = CreateStatusCaseStub;

      const result: StatusCase = StatusCasesStub.getOne();

      jest
        .spyOn(service, 'createStatusCase')
        .mockImplementation(async () => result);

      expect(await controller.createStatusCase(statusCase)).toBe(result);
      expect(service.createStatusCase).toHaveBeenCalled();
    });
  });

  describe('updateStatusCase', () => {
    it('should update one statusCase', async () => {
      const result: StatusCase = StatusCasesStub.getOne();

      const updated: UpdateStatusCaseDto = {
        name: 'NAME CHANGED',
      };

      jest
        .spyOn(service, 'updateStatusCase')
        .mockImplementation(async () => result);

      expect(await controller.updateStatusCase(result.id, updated)).toBe(
        result,
      );
      expect(service.updateStatusCase).toHaveBeenCalled();
    });
  });

  describe('deleteStatusCase', () => {
    it('should delete one statusCase', async () => {
      const statusCase: StatusCase = StatusCasesStub.getOne();

      const result: void = undefined;

      jest
        .spyOn(service, 'removeStatusCase')
        .mockImplementation(async () => result);

      expect(await controller.removeStatusCase(statusCase.id));
      expect(service.removeStatusCase).toHaveBeenCalled();
    });
  });
});
