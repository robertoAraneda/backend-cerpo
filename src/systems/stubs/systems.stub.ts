import { System } from '../entities/system.entity';

const systems: System[] = [
  {
    id: '8c26266f-3fe9-4b5b-bd88-bc2754415c12',
    active: true,
    name: 'System 1',
    createdAt: '2021-09-20T22:13:55.971Z',
    updatedAt: '2021-09-21T19:00:05.280Z',
    deletedAt: null,
  },
  {
    id: '7dc25590-d96f-47dc-a7df-49dfb665ecda',
    active: true,
    name: 'System 2',
    createdAt: '2021-09-20T22:13:55.971Z',
    updatedAt: '2021-09-21T19:00:05.280Z',
    deletedAt: null,
  },
  {
    id: '4b2d2652-43c2-4d35-990f-8f0ced3a46f4',
    active: true,
    name: 'System 3',
    createdAt: '2021-09-20T22:13:55.971Z',
    updatedAt: '2021-09-21T19:00:05.280Z',
    deletedAt: null,
  },
];

const getOne = (): System => systems[0];

const getAll = (): System[] => systems;

const length: number = systems.length;

export const SystemsStub = {
  getAll,
  getOne,
  length,
};
