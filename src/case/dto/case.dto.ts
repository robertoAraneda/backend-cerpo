import { IsObject, IsString } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { GestationalAge } from '../helpers/gestational-calculates.helper';

@Exclude()
export class CaseDto {
  @Expose()
  readonly id: number;
  @IsString()
  readonly title: string;
  @IsString()
  readonly conclusionReferenceUltrasound: string;
  @IsString()
  readonly diagnosis: string;
  @IsString()
  readonly diagnosisAbortus: string;
  @IsString()
  readonly diagnosisGravida: string;
  @IsString()
  readonly diagnosisPara: string;
  @IsString()
  readonly doppler: string;
  @IsString()
  readonly dueDateAt: string;
  @IsString()
  readonly echocardiogram: string;
  @IsString()
  readonly estimatedDateConfinement: string;
  @IsString()
  readonly fetalMagneticResonance: string;
  @IsString()
  readonly gestationalAgeReferenceUltrasound: string;
  @IsString()
  readonly highRiskAt: string;
  @IsString()
  readonly invasiveProcedure: string;
  @IsString()
  readonly karyogram: string;
  @IsString()
  readonly lastControlAt: string;
  @IsString()
  readonly lastMenstrualPeriodAt: string;
  @IsString()
  readonly neurosonography: string;
  @IsString()
  readonly nextControlAt: string;
  @IsString()
  readonly psychologistVisitAt: string;
  @IsString()
  readonly psychosocial: string;
  @IsString()
  readonly referenceUltrasoundAt: string;
  @IsString()
  readonly torch: string;
  @IsObject()
  readonly gestationalAge: GestationalAge;
}
