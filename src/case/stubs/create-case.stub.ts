import { CreateCaseDto } from '../dto/create-case.dto';
import { CommitteeResult } from '../../committee-result/entities/committee-result.entity';
import { DeliveryRoute } from '../../delivery-route/entities/delivery-route.entity';
import { Organization } from '../../organization/entities/organization.entity';
import { Patient } from '../../patient/entities/patient.entity';
import { User } from '../../user/entities/user.entity';
import { StatusCase } from '../../status-case/entities/status-case.entity';
import { System } from '../../system/entities/system.entity';

const CreateCaseStub = (
  patient: Patient,
  committeeResult: CommitteeResult,
  deliveryRoute: DeliveryRoute,
  organization: Organization,
  practitioner: User,
  statusCase: StatusCase,
  system: System,
): CreateCaseDto => {
  return {
    committeeResult,
    deliveryRoute,
    organization,
    patient,
    practitioner,
    statusCase,
    system,
    conclusionReferenceUltrasound: 'conclusionReferenceUltrasound',
    diagnosis: 'diagnosis',
    diagnosisAbortus: '11',
    diagnosisGravida: '22',
    diagnosisPara: '33',
    doppler: 'doppler',
    dueDateAt: '2022-03-20',
    echocardiogram: 'echocardiogram',
    estimatedDateConfinement: '2021-09-20',
    fetalMagneticResonance: 'fetalMagneticResonance',
    gestationalAgeReferenceUltrasound: 'gestationalAgeReferenceUltrasound',
    highRiskAt: '2021-09-20',
    invasiveProcedure: 'invasiveProcedure',
    karyogram: 'karyogram',
    lastControlAt: '2021-09-20',
    lastMenstrualPeriodAt: '2021-09-20',
    neurosonography: 'neurosonography',
    nextControlAt: '2021-09-20',
    psychologistVisitAt: '2021-09-20',
    psychosocial: 'psychosocial',
    referenceUltrasoundAt: '2021-09-20',
    title: 'title',
    torch: 'torch',
  };
};

export default CreateCaseStub;
