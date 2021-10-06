import { Commune } from '../entities/commune.entity';
import { Region } from '../../region/entities/region.entity';
import { RegionsStub } from '../../region/stubs/regions.stub';

const region: Region = RegionsStub.getOne();

const communes: Commune[] = [
  {
    code: 'code1',
    active: true,
    name: 'Commune 1',
    region: region,
    createdAt: '2021-09-20T22:13:55.971Z',
    updatedAt: '2021-09-21T19:00:05.280Z',
    deletedAt: null,
  },
  {
    code: 'code2',
    active: true,
    name: 'Commune 2',
    region: region,
    createdAt: '2021-09-20T22:13:55.971Z',
    updatedAt: '2021-09-21T19:00:05.280Z',
    deletedAt: null,
  },
  {
    code: 'code3',
    active: true,
    name: 'Commune 3',
    region: region,
    createdAt: '2021-09-20T22:13:55.971Z',
    updatedAt: '2021-09-21T19:00:05.280Z',
    deletedAt: null,
  },
];

const getOne = (): Commune => communes[0];

const getAll = (): Commune[] => communes;

const length: number = communes.length;

export const CommunesStub = {
  getAll,
  getOne,
  length,
};
