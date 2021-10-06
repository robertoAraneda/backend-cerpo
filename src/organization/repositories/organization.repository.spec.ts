import { OrganizationRepository } from './organization.repository';
import { Connection } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { createMemDB } from '../../config/create-memory-database';
import { Organization } from '../entities/organization.entity';
import { OrganizationsStub } from '../stubs/organizations.stub';
import { GetOrganizationsFilterDto } from '../dto/get-organizations-filter.dto';
import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { UpdateOrganizationDto } from '../dto/update-organization.dto';
import { OrganizationTypeEnum } from '../enums/organization-type.enum';

describe('OrganizationsRepository', () => {
  let repository: OrganizationRepository;
  let db: Connection;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [],
    }).compile();
    db = await createMemDB();
    repository = db.getCustomRepository<OrganizationRepository>(
      OrganizationRepository,
    );
  });

  afterEach(() => db.close());

  it('should repository be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('getOrganizations', () => {
    beforeEach(async () => {
      await Promise.all(
        OrganizationsStub.getAll().map(async (organization) => {
          await repository.createOrganization(organization);
        }),
      );
    });

    it('should return and array of Organizations', async () => {
      const mockedOrganizations: Organization[] = OrganizationsStub.getAll();
      jest.spyOn(repository, 'getOrganizations');

      const filterDto = {};

      const organizations = await repository.find();

      expect(await repository.getOrganizations(filterDto)).toStrictEqual(
        organizations,
      );

      expect(organizations.length).toBe(mockedOrganizations.length);
    });

    it('should return and array of filtered Organizations', async () => {
      const mockedOrganizations: Organization[] = OrganizationsStub.getAll();

      jest.spyOn(repository, 'getOrganizations');

      const organizations = await repository.find();

      const filterDto: GetOrganizationsFilterDto = {
        name: 'Organization 1',
        type: OrganizationTypeEnum.CONSULTANT,
      };

      expect(await repository.getOrganizations(filterDto)).toStrictEqual(
        [...organizations].filter((organization) =>
          organization.name.includes(filterDto.name),
        ),
      );

      expect(organizations.length).toBe(mockedOrganizations.length);
    });
  });

  describe('createOrganization', () => {
    it('should create one organization', async () => {
      jest.spyOn(repository, 'createOrganization');

      const createOrganizationDto: CreateOrganizationDto = {
        name: 'Organization 1',
        type: OrganizationTypeEnum.CONSULTANT,
      };

      const organization: Organization = await repository.createOrganization(
        createOrganizationDto,
      );

      expect(repository.createOrganization).toBeCalledTimes(1);
      expect(organization.constructor.name).toBe('Organization');
      expect(await repository.count()).toBe(1);
    });
  });

  describe('updateOrganization', () => {
    it('should updated one organization', async () => {
      jest.spyOn(repository, 'updateOrganization');

      const createOrganizationDto: CreateOrganizationDto = {
        name: 'Organization 1',
        type: OrganizationTypeEnum.CONSULTANT,
      };

      const organization: Organization = await repository.createOrganization(
        createOrganizationDto,
      );

      const updateOrganizationDto: UpdateOrganizationDto = {
        name: 'new name Organization',
      };

      const updatedOrganization: Organization =
        await repository.updateOrganization(
          organization.id,
          updateOrganizationDto,
        );

      expect(repository.updateOrganization).toBeCalledTimes(1);
      expect(updatedOrganization.constructor.name).toBe('Organization');
      expect(updatedOrganization.name).toBe(updateOrganizationDto.name);
    });
  });

  describe('deleteOrganization', () => {
    it('should delete one organization', async () => {
      jest.spyOn(repository, 'softRemove');

      const createOrganizationDto: CreateOrganizationDto = {
        name: 'Organization 1',
        type: OrganizationTypeEnum.CONSULTANT,
      };

      const organization: Organization = await repository.createOrganization(
        createOrganizationDto,
      );

      await repository.softRemove(organization);

      const getDeletedUser: Organization = await repository.findOne({
        where: { id: organization.id },
        withDeleted: true,
      });

      expect(repository.softRemove).toBeCalledTimes(1);
      expect(await repository.count()).toBe(0);
      expect(getDeletedUser.deletedAt).not.toBe(null);
    });
  });
});
