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
import { SystemService } from '../services/system.service';
import { CreateSystemDto } from '../dto/create-system.dto';
import { UpdateSystemDto } from '../dto/update-system.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/role.enum';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { UserAuthInterface } from '../../auth/interfaces/user-auth.interface';
import { GetSystemsFilterDto } from '../dto/get-systems-filter.dto';
import { System } from '../entities/system.entity';

@Controller({ version: '1', path: 'systems' })
@Roles(Role.ADMIN)
@UseGuards(JwtAuthGuard)
export class SystemController {
  private logger = new Logger('SystemController');
  constructor(private readonly systemsService: SystemService) {}

  @Post()
  @UsePipes(ValidationPipe)
  createSystem(@Body() createSystemDto: CreateSystemDto): Promise<System> {
    return this.systemsService.createSystem(createSystemDto);
  }

  @Get()
  getSystems(
    @GetUser() user: UserAuthInterface,
    @Query() filterDto: GetSystemsFilterDto,
  ): Promise<System[]> {
    this.logger.verbose(`User "${user.given}" retrieving all systems`);
    return this.systemsService.getSystems(filterDto);
  }

  @Get(':id')
  getSystemById(@Param('id') id: number): Promise<System> {
    return this.systemsService.getSystemById(+id);
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  updateSystem(
    @Param('id') id: number,
    @Body() updateSystemDto: UpdateSystemDto,
  ): Promise<System> {
    return this.systemsService.updateSystem(+id, updateSystemDto);
  }

  @Delete(':id')
  removeSystem(@Param('id') id: number): Promise<void> {
    return this.systemsService.removeSystem(+id);
  }
}
