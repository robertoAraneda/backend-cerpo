import { Module } from '@nestjs/common';
import { CommitteeResultService } from './services/committee-result.service';
import { CommitteeResultController } from './controllers/committee-result.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommitteeResultRepository } from './repositories/committee-result.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CommitteeResultRepository])],
  controllers: [CommitteeResultController],
  providers: [CommitteeResultService],
})
export class CommitteeResultsModule {}
