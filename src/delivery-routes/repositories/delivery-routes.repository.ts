import { EntityRepository, Repository } from 'typeorm';
import { DeliveryRoute } from '../entities/delivery-route.entity';
import { CreateDeliveryRouteDto } from '../dto/create-delivery-route.dto';
import { UpdateDeliveryRouteDto } from '../dto/update-delivery-route.dto';
import { GetDeliveryRoutesFilterDto } from '../dto/get-delivery-routes-filter.dto';

@EntityRepository(DeliveryRoute)
export class DeliveryRoutesRepository extends Repository<DeliveryRoute> {
  async getDeliveryRoutes(
    filterDto: GetDeliveryRoutesFilterDto,
  ): Promise<DeliveryRoute[]> {
    const { name } = filterDto;

    const query = this.createQueryBuilder('delivery_route');

    if (name) {
      query.andWhere('delivery_route.name ILIKE :name', { name: `%${name}%` });
    }

    return await query.getMany();
  }

  async createDeliveryRoute(
    createDeliveryRouteDto: CreateDeliveryRouteDto,
  ): Promise<DeliveryRoute> {
    const deliveryRoute = new DeliveryRoute(createDeliveryRouteDto);

    return await this.save(deliveryRoute);
  }

  async updateDeliveryRoute(
    id: number,
    updateDeliveryRouteDto: UpdateDeliveryRouteDto,
  ): Promise<DeliveryRoute> {
    const deliveryRoute = await this.findOne(id);

    this.merge(deliveryRoute, updateDeliveryRouteDto);

    return await this.save(deliveryRoute);
  }
}
