import { CommitteeResult } from '../entities/committee-result.entity';

const committeeResults: CommitteeResult[] = [
  {
    id: 1,
    active: true,
    name: 'CommitteeResult 1',
    createdAt: '2021-09-20T22:13:55.971Z',
    updatedAt: '2021-09-21T19:00:05.280Z',
    deletedAt: null,
  },
  {
    id: 2,
    active: true,
    name: 'CommitteeResult 2',
    createdAt: '2021-09-20T22:13:55.971Z',
    updatedAt: '2021-09-21T19:00:05.280Z',
    deletedAt: null,
  },
  {
    id: 3,
    active: true,
    name: 'CommitteeResult 3',
    createdAt: '2021-09-20T22:13:55.971Z',
    updatedAt: '2021-09-21T19:00:05.280Z',
    deletedAt: null,
  },
];

const getOne = (): CommitteeResult => committeeResults[0];

const getAll = (): CommitteeResult[] => committeeResults;

const length: number = committeeResults.length;

export const CommitteeResultsStub = {
  getAll,
  getOne,
  length,
};
