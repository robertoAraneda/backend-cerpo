import { Cache } from '../entities/cache.entity';

const caches: Cache[] = [
  {
    id: 1,
    type: 'Bearer',
    value: 'value1',
    expiresIn: 3000,
    createdAt: '2021-09-20T22:13:55.971Z',
    updatedAt: '2021-09-21T19:00:05.280Z',
  },
  {
    id: 2,
    type: 'Bearer',
    value: 'value2',
    expiresIn: 3000,
    createdAt: '2021-09-20T22:13:55.971Z',
    updatedAt: '2021-09-21T19:00:05.280Z',
  },
  {
    id: 3,
    type: 'Bearer',
    value: 'value3',
    expiresIn: 3000,
    createdAt: '2021-09-20T22:13:55.971Z',
    updatedAt: '2021-09-21T19:00:05.280Z',
  },
];

const getOne = (): Cache => caches[0];

const getAll = (): Cache[] => caches;

const length: number = caches.length;

export const CachesStub = {
  getAll,
  getOne,
  length,
};
