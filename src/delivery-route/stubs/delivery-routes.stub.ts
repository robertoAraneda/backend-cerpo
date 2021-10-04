import { DeliveryRoute } from '../entities/delivery-route.entity';

const deliveryRoutes: DeliveryRoute[] = [
  {
    id: 1,
    active: true,
    name: 'DeliveryRoute 1',
    createdAt: '2021-09-20T22:13:55.971Z',
    updatedAt: '2021-09-21T19:00:05.280Z',
    deletedAt: null,
  },
  {
    id: 2,
    active: true,
    name: 'DeliveryRoute 2',
    createdAt: '2021-09-20T22:13:55.971Z',
    updatedAt: '2021-09-21T19:00:05.280Z',
    deletedAt: null,
  },
  {
    id: 3,
    active: true,
    name: 'DeliveryRoute 3',
    createdAt: '2021-09-20T22:13:55.971Z',
    updatedAt: '2021-09-21T19:00:05.280Z',
    deletedAt: null,
  },
];

const getOne = (): DeliveryRoute => deliveryRoutes[0];

const getAll = (): DeliveryRoute[] => deliveryRoutes;

const length: number = deliveryRoutes.length;

export const DeliveryRoutesStub = {
  getAll,
  getOne,
  length,
};
