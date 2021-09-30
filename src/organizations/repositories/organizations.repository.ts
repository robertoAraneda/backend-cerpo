import { EntityRepository, Repository } from 'typeorm';
import { Organization } from '../entities/organization.entity';
import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { UpdateOrganizationDto } from '../dto/update-organization.dto';
import { GetOrganizationsFilterDto } from '../dto/get-organizations-filter.dto';

@EntityRepository(Organization)
export class OrganizationsRepository extends Repository<Organization> {
  async getOrganizations(
    filterDto: GetOrganizationsFilterDto,
  ): Promise<Organization[]> {
    const { name, type } = filterDto;

    const query = this.createQueryBuilder('organization');

    if (name) {
      query.andWhere('organization.name ILIKE :name', { name: `%${name}%` });
    }

    if (type) {
      query.andWhere('organization.type ILIKE :type', { type: `%${type}%` });
    }

    return await query.getMany();
  }

  async createOrganization(
    createOrganizationDto: CreateOrganizationDto,
  ): Promise<Organization> {
    const organization = new Organization(createOrganizationDto);

    return await this.save(organization);
  }

  async updateOrganization(
    id: string,
    updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<Organization> {
    const organization = await this.findOne(id);

    this.merge(organization, updateOrganizationDto);

    return await this.save(organization);
  }
}
