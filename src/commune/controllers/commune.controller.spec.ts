import { Test, TestingModule } from '@nestjs/testing';
import { CommuneController } from './commune.controller';
import { CommuneService } from '../services/commune.service';
import { Commune } from '../entities/commune.entity';
import { CommunesStub } from '../stubs/communes.stub';
import { UserAuthInterface } from '../../auth/interfaces/user-auth.interface';
import { CreateCommuneDto } from '../dto/create-commune.dto';
import { UpdateCommuneDto } from '../dto/update-commune.dto';
import { CommuneRepository } from '../repositories/commune.repository';
import CreateCommuneStub from '../stubs/create-commune.stub';
import { Region } from '../../region/entities/region.entity';

describe('CommunesController', () => {
  let controller: CommuneController;
  let service: CommuneService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommuneController],
      providers: [CommuneService, CommuneRepository],
    }).compile();

    controller = module.get<CommuneController>(CommuneController);
    service = module.get<CommuneService>(CommuneService);
  });

  it('should controller be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should service be defined', () => {
    expect(service).toBeDefined();
  });

  describe('GetCommunes', () => {
    it('should return and array of Communes', async () => {
      const result: Commune[] = CommunesStub.getAll();

      jest.spyOn(service, 'getCommunes').mockImplementation(async () => result);

      const user: UserAuthInterface = {
        id: '15654738-7',
        given: 'ROBERTO ALEJANDRO',
        fatherFamily: 'ARANEDA',
        motherFamily: 'ESPINOZA',
        role: 'admin',
      };
      const filterDto = {};

      expect(await controller.getCommunes(user, filterDto)).toBe(result);
      expect(service.getCommunes).toHaveBeenCalled();
    });
  });

  describe('CreateCommune', () => {
    it('should create one commune', async () => {
      const region: Region = undefined;
      const commune: CreateCommuneDto = CreateCommuneStub(region, 1);

      const result: Commune = CommunesStub.getOne();

      jest
        .spyOn(service, 'createCommune')
        .mockImplementation(async () => result);

      expect(await controller.createCommune(commune)).toBe(result);
      expect(service.createCommune).toHaveBeenCalled();
    });
  });

  describe('updateCommune', () => {
    it('should update one commune', async () => {
      const result: Commune = CommunesStub.getOne();

      const updated: UpdateCommuneDto = {
        name: 'NAME CHANGED',
      };

      jest
        .spyOn(service, 'updateCommune')
        .mockImplementation(async () => result);

      expect(await controller.updateCommune(result.code, updated)).toBe(result);
      expect(service.updateCommune).toHaveBeenCalled();
    });
  });

  describe('deleteCommune', () => {
    it('should delete one commune', async () => {
      const commune: Commune = CommunesStub.getOne();

      const result: void = undefined;

      jest
        .spyOn(service, 'removeCommune')
        .mockImplementation(async () => result);

      expect(await controller.removeCommune(commune.code));
      expect(service.removeCommune).toHaveBeenCalled();
    });
  });
});
