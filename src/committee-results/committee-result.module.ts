import { Module } from '@nestjs/common';
import { CommitteeResultsService } from './services/committee-results.service';
import { CommitteeResultsController } from './controllers/committee-results.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommitteeResultsRepository } from './repositories/committee-results.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CommitteeResultsRepository])],
  controllers: [CommitteeResultsController],
  providers: [CommitteeResultsService],
})
export class CommitteeResultsModule {}
