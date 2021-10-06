import { Module } from '@nestjs/common';
import { CommuneService } from './services/commune.service';
import { CommuneController } from './controllers/commune.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommuneRepository } from './repositories/commune.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CommuneRepository])],
  controllers: [CommuneController],
  providers: [CommuneService],
})
export class CommuneModule {}
