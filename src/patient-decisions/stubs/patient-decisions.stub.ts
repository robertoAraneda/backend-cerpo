import { PatientDecision } from '../entities/patient-decision.entity';

const patientDecisions: PatientDecision[] = [
  {
    id: 1,
    active: true,
    name: 'PatientDecision 1',
    createdAt: '2021-09-20T22:13:55.971Z',
    updatedAt: '2021-09-21T19:00:05.280Z',
    deletedAt: null,
  },
  {
    id: 2,
    active: true,
    name: 'PatientDecision 2',
    createdAt: '2021-09-20T22:13:55.971Z',
    updatedAt: '2021-09-21T19:00:05.280Z',
    deletedAt: null,
  },
  {
    id: 3,
    active: true,
    name: 'PatientDecision 3',
    createdAt: '2021-09-20T22:13:55.971Z',
    updatedAt: '2021-09-21T19:00:05.280Z',
    deletedAt: null,
  },
];

const getOne = (): PatientDecision => patientDecisions[0];

const getAll = (): PatientDecision[] => patientDecisions;

const length: number = patientDecisions.length;

export const PatientDecisionsStub = {
  getAll,
  getOne,
  length,
};
