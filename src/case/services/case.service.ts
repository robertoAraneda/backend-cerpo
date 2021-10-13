import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCaseDto } from '../dto/create-case.dto';
import { UpdateCaseDto } from '../dto/update-case.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CaseRepository } from '../repositories/case.repository';
import { Case } from '../entities/case.entity';
import { GetCasesFilterDto } from '../dto/get-cases-filter.dto';
import * as dayjs from 'dayjs';

@Injectable()
export class CaseService {
  constructor(
    @InjectRepository(CaseRepository)
    private readonly casesRepository: CaseRepository,
  ) {}

  async createCase(createCaseDto: CreateCaseDto): Promise<Case> {
    return await this.casesRepository.createCase(createCaseDto);
  }

  async getCases(filterDto: GetCasesFilterDto): Promise<Case[]> {
    return await this.casesRepository.getCases(filterDto);
  }

  async getCaseById(id: number) {
    const found = await this.casesRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`Case with ID "${id}" not found`);
    }
    return found;
  }

  async updateCase(id: number, updateCaseDto: UpdateCaseDto) {
    return await this.casesRepository.updateCase(id, updateCaseDto);
  }

  async removeCase(id: number): Promise<void> {
    try {
      const caseEntity = await this.getCaseById(id);
      await this.casesRepository.softRemove<Case>(caseEntity);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
