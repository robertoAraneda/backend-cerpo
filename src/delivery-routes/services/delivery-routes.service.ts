import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { DeliveryRoutesRepository } from '../repositories/delivery-routes.repository';
import { CreateDeliveryRouteDto } from '../dto/create-delivery-route.dto';
import { DeliveryRoute } from '../entities/delivery-route.entity';
import { GetDeliveryRoutesFilterDto } from '../dto/get-delivery-routes-filter.dto';
import { UpdateDeliveryRouteDto } from '../dto/update-delivery-route.dto';

@Injectable()
export class DeliveryRoutesService {
  constructor(
    @InjectRepository(DeliveryRoutesRepository)
    private readonly deliveryRoutesRepository: DeliveryRoutesRepository,
  ) {}

  async createDeliveryRoute(
    createDeliveryRouteDto: CreateDeliveryRouteDto,
  ): Promise<DeliveryRoute> {
    return await this.deliveryRoutesRepository.createDeliveryRoute(
      createDeliveryRouteDto,
    );
  }

  async getDeliveryRoutes(
    filterDto: GetDeliveryRoutesFilterDto,
  ): Promise<DeliveryRoute[]> {
    return await this.deliveryRoutesRepository.getDeliveryRoutes(filterDto);
  }

  async getDeliveryRouteById(id: string) {
    const found = await this.deliveryRoutesRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`DeliveryRoute with ID "${id}" not found`);
    }
    return found;
  }

  async updateDeliveryRoute(
    id: string,
    updateDeliveryRouteDto: UpdateDeliveryRouteDto,
  ) {
    return await this.deliveryRoutesRepository.updateDeliveryRoute(
      id,
      updateDeliveryRouteDto,
    );
  }

  async removeDeliveryRoute(id: string): Promise<void> {
    try {
      const deliveryRoute = await this.getDeliveryRouteById(id);
      await this.deliveryRoutesRepository.softRemove<DeliveryRoute>(
        deliveryRoute,
      );
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}