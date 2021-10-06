import { Module } from '@nestjs/common';
import { DeliveryRouteService } from './services/delivery-route.service';
import { DeliveryRouteController } from './controllers/delivery-route.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryRouteRepository } from './repositories/delivery-route.repository';
import { CaseRepository } from '../case/repositories/case.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([DeliveryRouteRepository, CaseRepository]),
  ],
  controllers: [DeliveryRouteController],
  providers: [DeliveryRouteService],
})
export class DeliveryRouteModule {}
