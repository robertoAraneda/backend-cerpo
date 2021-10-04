import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { CommitteeResultRepository } from '../repositories/committee-result.repository';
import { CreateCommitteeResultDto } from '../dto/create-committee-result.dto';
import { CommitteeResult } from '../entities/committee-result.entity';
import { GetCommitteeResultsFilterDto } from '../dto/get-committee-results-filter.dto';
import { UpdateCommitteeResultDto } from '../dto/update-committee-result.dto';

@Injectable()
export class CommitteeResultService {
  constructor(
    @InjectRepository(CommitteeResultRepository)
    private readonly committeeResultsRepository: CommitteeResultRepository,
  ) {}

  async createCommitteeResult(
    createCommitteeResultDto: CreateCommitteeResultDto,
  ): Promise<CommitteeResult> {
    return await this.committeeResultsRepository.createCommitteeResult(
      createCommitteeResultDto,
    );
  }

  async getCommitteeResults(
    filterDto: GetCommitteeResultsFilterDto,
  ): Promise<CommitteeResult[]> {
    return await this.committeeResultsRepository.getCommitteeResults(filterDto);
  }

  async getCommitteeResultById(id: number) {
    const found = await this.committeeResultsRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`CommitteeResult with ID "${id}" not found`);
    }
    return found;
  }

  async updateCommitteeResult(
    id: number,
    updateCommitteeResultDto: UpdateCommitteeResultDto,
  ) {
    return await this.committeeResultsRepository.updateCommitteeResult(
      id,
      updateCommitteeResultDto,
    );
  }

  async removeCommitteeResult(id: number): Promise<void> {
    try {
      const committeeResult = await this.getCommitteeResultById(id);
      await this.committeeResultsRepository.softRemove<CommitteeResult>(
        committeeResult,
      );
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
