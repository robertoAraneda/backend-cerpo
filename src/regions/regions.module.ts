import { Module } from '@nestjs/common';
import { RegionsService } from './services/regions.service';
import { RegionsController } from './controllers/regions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegionsRepository } from './repositories/regions.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RegionsRepository])],
  controllers: [RegionsController],
  providers: [RegionsService],
})
export class RegionsModule {}
