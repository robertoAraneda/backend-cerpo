import { EntityRepository, Repository } from 'typeorm';
import { PatientDecision } from '../entities/patient-decision.entity';
import { CreatePatientDecisionDto } from '../dto/create-patient-decision.dto';
import { UpdatePatientDecisionDto } from '../dto/update-patient-decision.dto';
import { GetPatientDecisionsFilterDto } from '../dto/get-patient-decisions-filter.dto';

@EntityRepository(PatientDecision)
export class PatientDecisionRepository extends Repository<PatientDecision> {
  async getPatientDecisions(
    filterDto: GetPatientDecisionsFilterDto,
  ): Promise<PatientDecision[]> {
    const { name } = filterDto;

    const query = this.createQueryBuilder('committee_result');

    if (name) {
      query.andWhere('committee_result.name ILIKE :name', {
        name: `%${name}%`,
      });
    }

    return await query.getMany();
  }

  async createPatientDecision(
    createPatientDecisionDto: CreatePatientDecisionDto,
  ): Promise<PatientDecision> {
    const patientDecision = new PatientDecision(createPatientDecisionDto);

    return await this.save(patientDecision);
  }

  async updatePatientDecision(
    id: number,
    updatePatientDecisionDto: UpdatePatientDecisionDto,
  ): Promise<PatientDecision> {
    const patientDecision = await this.findOne(id);

    this.merge(patientDecision, updatePatientDecisionDto);

    return await this.save(patientDecision);
  }
}
