import { PartialType } from '@nestjs/swagger';
import { CreateCommitteeResultDto } from './create-committee-result.dto';

export class UpdateCommitteeResultDto extends PartialType(CreateCommitteeResultDto) {}
