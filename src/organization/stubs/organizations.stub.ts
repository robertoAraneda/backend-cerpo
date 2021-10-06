import { Organization } from '../entities/organization.entity';
import { OrganizationTypeEnum } from '../enums/organization-type.enum';

const organizations: Organization[] = [
  {
    id: 1,
    active: true,
    name: 'Organization 1',
    type: OrganizationTypeEnum.CONSULTANT,
    telecom: 'telecom 1',
    cases: [],
    createdAt: '2021-09-20T22:13:55.971Z',
    updatedAt: '2021-09-21T19:00:05.280Z',
    deletedAt: null,
  },
  {
    id: 2,
    active: true,
    name: 'Organization 2',
    type: OrganizationTypeEnum.CONSULTANT,
    telecom: 'telecom 2',
    cases: [],
    createdAt: '2021-09-20T22:13:55.971Z',
    updatedAt: '2021-09-21T19:00:05.280Z',
    deletedAt: null,
  },
  {
    id: 3,
    active: true,
    name: 'Organization 3',
    type: OrganizationTypeEnum.EXPERT,
    telecom: 'telecom 3',
    cases: [],
    createdAt: '2021-09-20T22:13:55.971Z',
    updatedAt: '2021-09-21T19:00:05.280Z',
    deletedAt: null,
  },
];

const getOne = (): Organization => organizations[0];

const getAll = (): Organization[] => organizations;

const length: number = organizations.length;

export const OrganizationsStub = {
  getAll,
  getOne,
  length,
};
