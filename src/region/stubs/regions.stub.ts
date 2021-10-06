import { Region } from '../entities/region.entity';

const regions: Region[] = [
  {
    communes: [],
    active: true,
    name: 'Region 1',
    code: 'code 1',
    createdAt: '2021-09-20T22:13:55.971Z',
    updatedAt: '2021-09-21T19:00:05.280Z',
    deletedAt: null,
  },
  {
    communes: [],
    active: true,
    name: 'Region 2',
    code: 'code 2',
    createdAt: '2021-09-20T22:13:55.971Z',
    updatedAt: '2021-09-21T19:00:05.280Z',
    deletedAt: null,
  },
  {
    communes: [],
    active: true,
    name: 'Region 3',
    code: 'code 3',
    createdAt: '2021-09-20T22:13:55.971Z',
    updatedAt: '2021-09-21T19:00:05.280Z',
    deletedAt: null,
  },
];

const getOne = (): Region => regions[0];

const getAll = (): Region[] => regions;

const length: number = regions.length;

export const RegionsStub = {
  getAll,
  getOne,
  length,
};
