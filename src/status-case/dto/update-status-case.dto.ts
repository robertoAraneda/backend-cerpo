import { PartialType } from '@nestjs/mapped-types';
import { CreateStatusCaseDto } from './create-status-case.dto';

export class UpdateStatusCaseDto extends PartialType(CreateStatusCaseDto) {}
