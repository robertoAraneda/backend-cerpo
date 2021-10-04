import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationService } from './organization.service';
import { Organization } from '../entities/organization.entity';
import { OrganizationsStub } from '../stubs/organizations.stub';
import { OrganizationStub } from '../stubs/organization.stub';
import { NotFoundException } from '@nestjs/common';
import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { UpdateOrganizationDto } from '../dto/update-organization.dto';
import { OrganizationRepository } from '../repositories/organization.repository';
import { GetOrganizationsFilterDto } from '../dto/get-organizations-filter.dto';

describe('OrganizationsService', () => {
  let service: OrganizationService;
  let repository: OrganizationRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrganizationService, OrganizationRepository],
    }).compile();

    service = module.get<OrganizationService>(OrganizationService);
    repository = module.get<OrganizationRepository>(OrganizationRepository);
  });

  it('should service be defined', () => {
    expect(service).toBeDefined();
  });

  it('should repository be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('GetOrganizations', () => {
    it('should return and array of Organizations', async () => {
      const result: Organization[] = OrganizationsStub.getAll();

      jest
        .spyOn(repository, 'getOrganizations')
        .mockImplementation(async () => result);

      const filterDto: GetOrganizationsFilterDto = {
        name: 'Organization 1',
      };

      expect(await service.getOrganizations(filterDto)).toBe(result);
      expect(repository.getOrganizations).toHaveBeenCalled();
    });
  });

  describe('GetOrganization', () => {
    it('should return a organization founded by id', async () => {
      const result: Organization = OrganizationsStub.getOne();

      jest.spyOn(repository, 'findOne').mockImplementation(async () => result);

      expect(await service.getOrganizationById(result.id)).toBe(result);
      expect(repository.findOne).toHaveBeenCalled();
    });

    it("should throw an NotFoundHttpException if organization doesn't exist", async () => {
      const result: Organization = OrganizationsStub.getOne();

      jest
        .spyOn(repository, 'findOne')
        .mockImplementation(async () => undefined);

      try {
        await service.getOrganizationById(result.id);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }

      expect(repository.findOne).toHaveBeenCalled();
    });
  });

  describe('CreateOrganization', () => {
    it('should create one organization', async () => {
      const createOrganizationDto: CreateOrganizationDto = OrganizationStub;
      const result: Organization = OrganizationsStub.getOne();

      jest
        .spyOn(repository, 'createOrganization')
        .mockImplementation(async () => result);

      expect(await service.createOrganization(createOrganizationDto)).toBe(
        result,
      );
      expect(repository.createOrganization).toHaveBeenCalled();
    });
  });

  describe('UpdateOrganization', () => {
    it('should update one organization', async () => {
      const organization: Organization = OrganizationsStub.getOne();

      const updateOrganizationDto: UpdateOrganizationDto = {
        name: 'New name Organization',
      };

      jest
        .spyOn(repository, 'updateOrganization')
        .mockImplementation(async () => organization);

      expect(
        await service.updateOrganization(
          organization.id,
          updateOrganizationDto,
        ),
      ).toBe(organization);
      expect(repository.updateOrganization).toHaveBeenCalled();
    });
  });

  describe('DeleteOrganization', () => {
    it('should delete one organization', async () => {
      const organization: Organization = OrganizationsStub.getOne();

      jest
        .spyOn(repository, 'softRemove')
        .mockImplementation(async () => undefined);

      jest
        .spyOn(service, 'getOrganizationById')
        .mockImplementation(async () => organization);

      expect(await service.removeOrganization(organization.id)).toBe(undefined);
      expect(repository.softRemove).toHaveBeenCalledTimes(1);
      expect(service.getOrganizationById).toHaveBeenCalledTimes(1);
    });
  });
});
