import { Module } from '@nestjs/common';
import { SystemsService } from './services/systems.service';
import { SystemsController } from './controllers/systems.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemsRepository } from './repositories/systems.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SystemsRepository])],
  controllers: [SystemsController],
  providers: [SystemsService],
})
export class SystemsModule {}
