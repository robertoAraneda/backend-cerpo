import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePatientDecisionDto {
  @IsNotEmpty() @IsString() name: string;
}
