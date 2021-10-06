import { Module } from '@nestjs/common';
import { CaseService } from './services/case.service';
import { CaseController } from './controllers/case.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaseRepository } from './repositories/case.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CaseRepository])],
  controllers: [CaseController],
  providers: [CaseService],
})
export class CaseModule {}
