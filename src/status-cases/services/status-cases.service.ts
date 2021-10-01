import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { StatusCasesRepository } from '../repositories/status-cases.repository';
import { CreateStatusCaseDto } from '../dto/create-status-case.dto';
import { StatusCase } from '../entities/status-case.entity';
import { GetStatusCasesFilterDto } from '../dto/get-status-cases-filter.dto';
import { UpdateStatusCaseDto } from '../dto/update-status-case.dto';

@Injectable()
export class StatusCasesService {
  constructor(
    @InjectRepository(StatusCasesRepository)
    private readonly statusCasesRepository: StatusCasesRepository,
  ) {}

  async createStatusCase(
    createStatusCaseDto: CreateStatusCaseDto,
  ): Promise<StatusCase> {
    return await this.statusCasesRepository.createStatusCase(
      createStatusCaseDto,
    );
  }

  async getStatusCases(
    filterDto: GetStatusCasesFilterDto,
  ): Promise<StatusCase[]> {
    return await this.statusCasesRepository.getStatusCases(filterDto);
  }

  async getStatusCaseById(id: string) {
    const found = await this.statusCasesRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`StatusCase with ID "${id}" not found`);
    }
    return found;
  }

  async updateStatusCase(id: string, updateStatusCaseDto: UpdateStatusCaseDto) {
    return await this.statusCasesRepository.updateStatusCase(
      id,
      updateStatusCaseDto,
    );
  }

  async removeStatusCase(id: string): Promise<void> {
    try {
      const statusCase = await this.getStatusCaseById(id);
      await this.statusCasesRepository.softRemove<StatusCase>(statusCase);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
