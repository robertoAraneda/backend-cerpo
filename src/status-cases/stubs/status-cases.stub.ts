import { StatusCase } from '../entities/status-case.entity';

const statusCases: StatusCase[] = [
  {
    id: '8c26266f-3fe9-4b5b-bd88-bc2754415c12',
    active: true,
    name: 'StatusCase 1',
    description: 'Description 1',
    color: 'Color 1',
    createdAt: '2021-09-20T22:13:55.971Z',
    updatedAt: '2021-09-21T19:00:05.280Z',
    deletedAt: null,
  },
  {
    id: '7dc25590-d96f-47dc-a7df-49dfb665ecda',
    active: true,
    name: 'StatusCase 2',
    description: 'Description 2',
    color: 'Color 2',
    createdAt: '2021-09-20T22:13:55.971Z',
    updatedAt: '2021-09-21T19:00:05.280Z',
    deletedAt: null,
  },
  {
    id: '4b2d2652-43c2-4d35-990f-8f0ced3a46f4',
    active: true,
    name: 'StatusCase 3',
    description: 'Description 3',
    color: 'Color 3',
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