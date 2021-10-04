import { Module } from '@nestjs/common';
import { RegionService } from './services/region.service';
import { RegionController } from './controllers/region.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegionRepository } from './repositories/region.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RegionRepository])],
  controllers: [RegionController],
  providers: [RegionService],
})
export class RegionModule {}
