import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from '../services/organization.service';
import { Organization } from '../entities/organization.entity';
import { OrganizationsStub } from '../stubs/organizations.stub';
import { UserAuthInterface } from '../../auth/interfaces/user-auth.interface';
import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { UpdateOrganizationDto } from '../dto/update-organization.dto';
import { OrganizationRepository } from '../repositories/organization.repository';
import { OrganizationStub } from '../stubs/organization.stub';

describe('OrganizationsController', () => {
  let controller: OrganizationController;
  let service: OrganizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationController],
      providers: [OrganizationService, OrganizationRepository],
    }).compile();

    controller = module.get<OrganizationController>(OrganizationController);
    service = module.get<OrganizationService>(OrganizationService);
  });

  it('should controller be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should service be defined', () => {
    expect(service).toBeDefined();
  });

  describe('GetOrganizations', () => {
    it('should return and array of Organizations', async () => {
      const result: Organization[] = OrganizationsStub.getAll();

      jest
        .spyOn(service, 'getOrganizations')
        .mockImplementation(async () => result);

      const user: UserAuthInterface = {
        id: '15654738-7',
        given: 'ROBERTO ALEJANDRO',
        fatherFamily: 'ARANEDA',
        motherFamily: 'ESPINOZA',
        role: 'admin',
      };
      const filterDto = {};

      expect(await controller.getOrganizations(user, filterDto)).toBe(result);
      expect(service.getOrganizations).toHaveBeenCalled();
    });
  });

  describe('CreateOrganization', () => {
    it('should create one organization', async () => {
      const organization: CreateOrganizationDto = OrganizationStub;

      const result: Organization = OrganizationsStub.getOne();

      jest
        .spyOn(service, 'createOrganization')
        .mockImplementation(async () => result);

      expect(await controller.createOrganization(organization)).toBe(result);
      expect(service.createOrganization).toHaveBeenCalled();
    });
  });

  describe('updateOrganization', () => {
    it('should update one organization', async () => {
      const result: Organization = OrganizationsStub.getOne();

      const updated: UpdateOrganizationDto = {
        name: 'NAME CHANGED',
      };

      jest
        .spyOn(service, 'updateOrganization')
        .mockImplementation(async () => result);

      expect(await controller.updateOrganization(result.id, updated)).toBe(
        result,
      );
      expect(service.updateOrganization).toHaveBeenCalled();
    });
  });

  describe('deleteOrganization', () => {
    it('should delete one organization', async () => {
      const organization: Organization = OrganizationsStub.getOne();

      const result: void = undefined;

      jest
        .spyOn(service, 'removeOrganization')
        .mockImplementation(async () => result);

      expect(await controller.removeOrganization(organization.id));
      expect(service.removeOrganization).toHaveBeenCalled();
    });
  });
});
