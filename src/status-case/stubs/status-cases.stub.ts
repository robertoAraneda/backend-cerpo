import { StatusCase } from '../entities/status-case.entity';

const statusCases: StatusCase[] = [
  {
    id: 1,
    active: true,
    name: 'StatusCase 1',
    description: 'Description 1',
    color: 'Color 1',
    cases: [],
    createdAt: '2021-09-20T22:13:55.971Z',
    updatedAt: '2021-09-21T19:00:05.280Z',
    deletedAt: null,
  },
  {
    id: 2,
    active: true,
    name: 'StatusCase 2',
    description: 'Description 2',
    color: 'Color 2',
    cases: [],
    createdAt: '2021-09-20T22:13:55.971Z',
    updatedAt: '2021-09-21T19:00:05.280Z',
    deletedAt: null,
  },
  {
    id: 3,
    active: true,
    name: 'StatusCase 3',
    description: 'Description 3',
    color: 'Color 3',
    cases: [],
    createdAt: '2021-09-20T22:13:55.971Z',
    updatedAt: '2021-09-21T19:00:05.280Z',
    deletedAt: null,
  },
];

const getOne = (): StatusCase => statusCases[0];

const getAll = (): StatusCase[] => statusCases;

const length: number = statusCases.length;

export const StatusCasesStub = {
  getAll,
  getOne,
  length,
};
