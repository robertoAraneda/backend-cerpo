import { Case } from '../entities/case.entity';
import { CommitteeResult } from '../../committee-result/entities/committee-result.entity';
import { CommitteeResultsStub } from '../../committee-result/stubs/committee-results.stub';
import { DeliveryRoute } from '../../delivery-route/entities/delivery-route.entity';
import { DeliveryRoutesStub } from '../../delivery-route/stubs/delivery-routes.stub';
import { Organization } from '../../organization/entities/organization.entity';
import { OrganizationsStub } from '../../organization/stubs/organizations.stub';
import { Patient } from '../../patient/entities/patient.entity';
import { PatientsStub } from '../../patient/stubs/patients.stub';
import { User } from '../../user/entities/user.entity';
import { UsersStub } from '../../user/stubs/users.stub';
import { StatusCase } from '../../status-case/entities/status-case.entity';
import { StatusCasesStub } from '../../status-case/stubs/status-cases.stub';
import { System } from '../../system/entities/system.entity';
import { SystemsStub } from '../../system/stubs/systems.stub';

const committeeResult: CommitteeResult = CommitteeResultsStub.getOne();
const deliveryRoute: DeliveryRoute = DeliveryRoutesStub.getOne();
const organization: Organization = OrganizationsStub.getOne();
const patient: Patient = PatientsStub.getOne();
const practitioner: User = UsersStub.getOne();
const statusCase: StatusCase = StatusCasesStub.getOne();
const system: System = SystemsStub.getOne();

const cases: Case[] = [
  {
    id: 1,
    title: 'title',
    torch: 'torch',
    conclusionReferenceUltrasound: 'conclusionReferenceUltrasound',
    diagnosis: 'diagnosis',
    diagnosisAbortus: 'diagnosisAbortus',
    diagnosisGravida: 'diagnosisGravida',
    diagnosisPara: 'diagnosisPara',
    doppler: 'doppler',
    dueDateAt: '2021-09-20',
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
    psychologistVisitAt: '2021-09-20At',
    psychosocial: 'psychosocial',
    referenceUltrasoundAt: '2021-09-20',
    organization,
    patient,
    practitioner,
    deliveryRoute,
    committeeResult,
    statusCase,
    system,
    active: true,
    createdAt: '2021-09-20T22:13:55.971Z',
    updatedAt: '2021-09-21T19:00:05.280Z',
    deletedAt: null,
  },
  {
    id: 2,
    title: 'title',
    torch: 'torch',
    conclusionReferenceUltrasound: 'conclusionReferenceUltrasound',
    diagnosis: 'diagnosis',
    diagnosisAbortus: 'diagnosisAbortus',
    diagnosisGravida: 'diagnosisGravida',
    diagnosisPara: 'diagnosisPara',
    doppler: 'doppler',
    dueDateAt: '2021-09-20',
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
    psychologistVisitAt: '2021-09-20At',
    psychosocial: 'psychosocial',
    referenceUltrasoundAt: '2021-09-20',
    organization,
    patient,
    practitioner,
    deliveryRoute,
    committeeResult,
    statusCase,
    system,
    active: true,
    createdAt: '2021-09-20T22:13:55.971Z',
    updatedAt: '2021-09-21T19:00:05.280Z',
    deletedAt: null,
  },
  {
    id: 3,
    title: 'title',
    torch: 'torch',
    conclusionReferenceUltrasound: 'conclusionReferenceUltrasound',
    diagnosis: 'diagnosis',
    diagnosisAbortus: 'diagnosisAbortus',
    diagnosisGravida: 'diagnosisGravida',
    diagnosisPara: 'diagnosisPara',
    doppler: 'doppler',
    dueDateAt: '2021-09-20',
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
    psychologistVisitAt: '2021-09-20At',
    psychosocial: 'psychosocial',
    referenceUltrasoundAt: '2021-09-20',
    organization,
    patient,
    practitioner,
    deliveryRoute,
    committeeResult,
    statusCase,
    system,
    active: true,
    createdAt: '2021-09-20T22:13:55.971Z',
    updatedAt: '2021-09-21T19:00:05.280Z',
    deletedAt: null,
  },
];

const getOne = (): Case => cases[0];

const getAll = (): Case[] => cases;

const length: number = cases.length;

export const CasesStub = {
  getAll,
  getOne,
  length,
};
