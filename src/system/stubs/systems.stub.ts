import { System } from '../entities/system.entity';

const systems: System[] = [
  {
    id: 1,
    active: true,
    name: 'System 1',
    createdAt: '2021-09-20T22:13:55.971Z',
    updatedAt: '2021-09-21T19:00:05.280Z',
    deletedAt: null,
  },
  {
    id: 2,
    active: true,
    name: 'System 2',
    createdAt: '2021-09-20T22:13:55.971Z',
    updatedAt: '2021-09-21T19:00:05.280Z',
    deletedAt: null,
  },
  {
    id: 3,
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
