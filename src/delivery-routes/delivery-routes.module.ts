import { Module } from '@nestjs/common';
import { DeliveryRoutesService } from './services/delivery-routes.service';
import { DeliveryRoutesController } from './controllers/delivery-routes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryRoutesRepository } from './repositories/delivery-routes.repository';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryRoutesRepository])],
  controllers: [DeliveryRoutesController],
  providers: [DeliveryRoutesService],
})
export class DeliveryRoutesModule {}
