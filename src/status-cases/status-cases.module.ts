import { Module } from '@nestjs/common';
import { StatusCasesService } from './services/status-cases.service';
import { StatusCasesController } from './controllers/status-cases.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusCasesRepository } from './repositories/status-cases.repository';

@Module({
  imports: [TypeOrmModule.forFeature([StatusCasesRepository])],
  controllers: [StatusCasesController],
  providers: [StatusCasesService],
})
export class StatusCasesModule {}
