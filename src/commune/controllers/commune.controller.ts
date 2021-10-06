import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UsePipes,
  ValidationPipe,
  Logger,
} from '@nestjs/common';
import { CommuneService } from '../services/commune.service';
import { CreateCommuneDto } from '../dto/create-commune.dto';
import { UpdateCommuneDto } from '../dto/update-commune.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/role.enum';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { UserAuthInterface } from '../../auth/interfaces/user-auth.interface';
import { GetCommunesFilterDto } from '../dto/get-communes-filter.dto';
import { Commune } from '../entities/commune.entity';

@Controller({ version: '1', path: 'communes' })
@Roles(Role.ADMIN)
@UseGuards(JwtAuthGuard)
export class CommuneController {
  private logger = new Logger('CommuneController');
  constructor(private readonly communeService: CommuneService) {}

  @Post()
  @UsePipes(ValidationPipe)
  createCommune(@Body() createCommuneDto: CreateCommuneDto): Promise<Commune> {
    return this.communeService.createCommune(createCommuneDto);
  }

  @Get()
  getCommunes(
    @GetUser() user: UserAuthInterface,
    @Query() filterDto: GetCommunesFilterDto,
  ): Promise<Commune[]> {
    this.logger.verbose(`User "${user.given}" retrieving all communes`);
    return this.communeService.getCommunes(filterDto);
  }

  @Get(':code')
  getCommuneById(@Param('code') code: string): Promise<Commune> {
    return this.communeService.getCommuneById(code);
  }

  @Patch(':code')
  @UsePipes(ValidationPipe)
  updateCommune(
    @Param('code') code: string,
    @Body() updateCommuneDto: UpdateCommuneDto,
  ): Promise<Commune> {
    return this.communeService.updateCommune(code, updateCommuneDto);
  }

  @Delete(':code')
  removeCommune(@Param('code') code: string): Promise<void> {
    return this.communeService.removeCommune(code);
  }
}
