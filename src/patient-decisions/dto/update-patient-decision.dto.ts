import { PartialType } from '@nestjs/swagger';
import { CreatePatientDecisionDto } from './create-patient-decision.dto';

export class UpdatePatientDecisionDto extends PartialType(
  CreatePatientDecisionDto,
) {}
