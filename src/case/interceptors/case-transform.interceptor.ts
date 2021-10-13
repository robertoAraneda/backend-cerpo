import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CaseDto } from '../dto/case.dto';
import { GestationalCalculatesHelper } from '../helpers/gestational-calculates.helper';

@Injectable()
export class CaseTransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return data.map(
          ({
            id,
            title,
            diagnosis,
            diagnosisAbortus,
            diagnosisGravida,
            diagnosisPara,
            dueDateAt,
            doppler,
            estimatedDateConfinement,
            echocardiogram,
            fetalMagneticResonance,
            gestationalAgeReferenceUltrasound,
            conclusionReferenceUltrasound,
            referenceUltrasoundAt,
            invasiveProcedure,
            karyogram,
            lastControlAt,
            nextControlAt,
            lastMenstrualPeriodAt,
            neurosonography,
            psychologistVisitAt,
            psychosocial,
            torch,
            highRiskAt,
          }: CaseDto): CaseDto => ({
            id,
            title,
            diagnosis,
            diagnosisAbortus,
            diagnosisGravida,
            diagnosisPara,
            dueDateAt,
            doppler,
            estimatedDateConfinement,
            echocardiogram,
            fetalMagneticResonance,
            gestationalAgeReferenceUltrasound,
            conclusionReferenceUltrasound,
            referenceUltrasoundAt,
            invasiveProcedure,
            karyogram,
            lastControlAt,
            nextControlAt,
            lastMenstrualPeriodAt,
            neurosonography,
            psychologistVisitAt,
            psychosocial,
            torch,
            highRiskAt,
            gestationalAge: GestationalCalculatesHelper(
              lastMenstrualPeriodAt,
              dueDateAt,
            ),
          }),
        );
      }),
    );
  }
}
