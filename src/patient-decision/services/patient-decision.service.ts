import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { PatientDecisionRepository } from '../repositories/patient-decision.repository';
import { CreatePatientDecisionDto } from '../dto/create-patient-decision.dto';
import { PatientDecision } from '../entities/patient-decision.entity';
import { GetPatientDecisionsFilterDto } from '../dto/get-patient-decisions-filter.dto';
import { UpdatePatientDecisionDto } from '../dto/update-patient-decision.dto';

@Injectable()
export class PatientDecisionService {
  constructor(
    @InjectRepository(PatientDecisionRepository)
    private readonly patientDecisionsRepository: PatientDecisionRepository,
  ) {}

  async createPatientDecision(
    createPatientDecisionDto: CreatePatientDecisionDto,
  ): Promise<PatientDecision> {
    return await this.patientDecisionsRepository.createPatientDecision(
      createPatientDecisionDto,
    );
  }

  async getPatientDecisions(
    filterDto: GetPatientDecisionsFilterDto,
  ): Promise<PatientDecision[]> {
    return await this.patientDecisionsRepository.getPatientDecisions(filterDto);
  }

  async getPatientDecisionById(id: number) {
    const found = await this.patientDecisionsRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`PatientDecision with ID "${id}" not found`);
    }
    return found;
  }

  async updatePatientDecision(
    id: number,
    updatePatientDecisionDto: UpdatePatientDecisionDto,
  ) {
    return await this.patientDecisionsRepository.updatePatientDecision(
      id,
      updatePatientDecisionDto,
    );
  }

  async removePatientDecision(id: number): Promise<void> {
    try {
      const patientDecision = await this.getPatientDecisionById(id);
      await this.patientDecisionsRepository.softRemove<PatientDecision>(
        patientDecision,
      );
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
