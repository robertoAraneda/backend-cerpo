import { Module } from '@nestjs/common';
import { SystemService } from './services/system.service';
import { SystemController } from './controllers/system.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemRepository } from './repositories/system.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SystemRepository])],
  controllers: [SystemController],
  providers: [SystemService],
})
export class SystemModule {}
