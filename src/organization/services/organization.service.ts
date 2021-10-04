import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { UpdateOrganizationDto } from '../dto/update-organization.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationRepository } from '../repositories/organization.repository';
import { Organization } from '../entities/organization.entity';
import { GetOrganizationsFilterDto } from '../dto/get-organizations-filter.dto';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(OrganizationRepository)
    private readonly organizationsRepository: OrganizationRepository,
  ) {}

  async createOrganization(
    createOrganizationDto: CreateOrganizationDto,
  ): Promise<Organization> {
    return await this.organizationsRepository.createOrganization(
      createOrganizationDto,
    );
  }

  async getOrganizations(
    filterDto: GetOrganizationsFilterDto,
  ): Promise<Organization[]> {
    return await this.organizationsRepository.getOrganizations(filterDto);
  }

  async getOrganizationById(id: number) {
    const found = await this.organizationsRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`Organization with ID "${id}" not found`);
    }
    return found;
  }

  async updateOrganization(
    id: number,
    updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return await this.organizationsRepository.updateOrganization(
      id,
      updateOrganizationDto,
    );
  }

  async removeOrganization(id: number): Promise<void> {
    try {
      const organization = await this.getOrganizationById(id);
      await this.organizationsRepository.softRemove<Organization>(organization);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
