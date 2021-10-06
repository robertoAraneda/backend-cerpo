import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';
import { CommitteeResult } from '../../committee-result/entities/committee-result.entity';
import { DeliveryRoute } from '../../delivery-route/entities/delivery-route.entity';
import { Organization } from '../../organization/entities/organization.entity';
import { Patient } from '../../patient/entities/patient.entity';
import { User } from '../../user/entities/user.entity';
import { StatusCase } from '../../status-case/entities/status-case.entity';
import { System } from '../../system/entities/system.entity';

export class CreateCaseDto {
  @IsNotEmpty() @IsString() title: string;
  @IsNotEmpty() @IsString() gestationalAgeReferenceUltrasound: string;
  @IsNotEmpty() @IsString() conclusionReferenceUltrasound: string;

  @IsNotEmpty() @IsString() diagnosis: string;
  @IsNotEmpty() @IsString() @Length(2, 2) diagnosisGravida: string;
  @IsNotEmpty() @IsString() @Length(2, 2) diagnosisPara: string;
  @IsNotEmpty() @IsString() @Length(2, 2) diagnosisAbortus: string;
  @IsNotEmpty() @IsString() echocardiogram: string;
  @IsNotEmpty() @IsString() neurosonography: string;
  @IsNotEmpty() @IsString() fetalMagneticResonance: string;
  @IsNotEmpty() @IsString() invasiveProcedure: string;
  @IsNotEmpty() @IsString() karyogram: string;
  @IsNotEmpty() @IsString() doppler: string;

  @IsNotEmpty() @IsString() torch: string;
  @IsNotEmpty() @IsString() psychosocial: string;
  @IsNotEmpty() @IsString() @IsDateString() referenceUltrasoundAt: string;
  @IsNotEmpty() @IsString() @IsDateString() lastMenstrualPeriodAt: string;
  @IsNotEmpty() @IsString() @IsDateString() lastControlAt: string;
  @IsNotEmpty() @IsString() @IsDateString() nextControlAt: string;

  @IsNotEmpty() @IsString() @IsDateString() estimatedDateConfinement: string;
  @IsNotEmpty() @IsString() @IsDateString() highRiskAt: string;
  @IsNotEmpty() @IsString() @IsDateString() dueDateAt: string;
  @IsNotEmpty() @IsString() @IsDateString() psychologistVisitAt: string;

  @IsNumber() committeeResult: CommitteeResult;
  @IsNumber() deliveryRoute: DeliveryRoute;
  @IsNumber() organization: Organization;
  @IsNumber() patient: Patient;
  @IsNumber() practitioner: User;
  @IsNumber() statusCase: StatusCase;
  @IsNumber() system: System;
}
