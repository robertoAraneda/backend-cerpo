import { Test, TestingModule } from '@nestjs/testing';
import { CommitteeResultsRepository } from '../repositories/committee-results.repository';
import { CommitteeResult } from '../entities/committee-result.entity';
import { CommitteeResultsStub } from '../stubs/committee-results.stub';
import { UserAuthInterface } from '../../auth/interfaces/user-auth.interface';
import { CreateCommitteeResultDto } from '../dto/create-committee-result.dto';
import { CreateCommitteeResultStub } from '../stubs/create-committee-result.stub';
import { UpdateCommitteeResultDto } from '../dto/update-committee-result.dto';
import { CommitteeResultsController } from './committee-results.controller';
import { CommitteeResultsService } from '../services/committee-results.service';

describe('CommitteeResultsController', () => {
  let controller: CommitteeResultsController;
  let service: CommitteeResultsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommitteeResultsController],
      providers: [CommitteeResultsService, CommitteeResultsRepository],
    }).compile();

    controller = module.get<CommitteeResultsController>(
      CommitteeResultsController,
    );
    service = module.get<CommitteeResultsService>(CommitteeResultsService);
  });

  it('should controller be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should service be defined', () => {
    expect(service).toBeDefined();
  });

  describe('GetCommitteeResults', () => {
    it('should return and array of CommitteeResults', async () => {
      const result: CommitteeResult[] = CommitteeResultsStub.getAll();

      jest
        .spyOn(service, 'getCommitteeResults')
        .mockImplementation(async () => result);

      const user: UserAuthInterface = {
        id: '15654738-7',
        given: 'ROBERTO ALEJANDRO',
        fatherFamily: 'ARANEDA',
        motherFamily: 'ESPINOZA',
        role: 'admin',
      };
      const filterDto = {};

      expect(await controller.getCommitteeResults(user, filterDto)).toBe(
        result,
      );
      expect(service.getCommitteeResults).toHaveBeenCalled();
    });
  });

  describe('CreateCommitteeResult', () => {
    it('should create one committeeResult', async () => {
      const committeeResult: CreateCommitteeResultDto =
        CreateCommitteeResultStub;

      const result: CommitteeResult = CommitteeResultsStub.getOne();

      jest
        .spyOn(service, 'createCommitteeResult')
        .mockImplementation(async () => result);

      expect(await controller.createCommitteeResult(committeeResult)).toBe(
        result,
      );
      expect(service.createCommitteeResult).toHaveBeenCalled();
    });
  });

  describe('updateCommitteeResult', () => {
    it('should update one committeeResult', async () => {
      const result: CommitteeResult = CommitteeResultsStub.getOne();

      const updated: UpdateCommitteeResultDto = {
        name: 'NAME CHANGED',
      };

      jest
        .spyOn(service, 'updateCommitteeResult')
        .mockImplementation(async () => result);

      expect(await controller.updateCommitteeResult(result.id, updated)).toBe(
        result,
      );
      expect(service.updateCommitteeResult).toHaveBeenCalled();
    });
  });

  describe('deleteCommitteeResult', () => {
    it('should delete one committeeResult', async () => {
      const committeeResult: CommitteeResult = CommitteeResultsStub.getOne();

      const result: void = undefined;

      jest
        .spyOn(service, 'removeCommitteeResult')
        .mockImplementation(async () => result);

      expect(await controller.removeCommitteeResult(committeeResult.id));
      expect(service.removeCommitteeResult).toHaveBeenCalled();
    });
  });
});
