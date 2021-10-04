import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Logger,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { DeliveryRoutesService } from '../services/delivery-routes.service';
import { CreateDeliveryRouteDto } from '../dto/create-delivery-route.dto';
import { UpdateDeliveryRouteDto } from '../dto/update-delivery-route.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/role.enum';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { DeliveryRoute } from '../entities/delivery-route.entity';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { UserAuthInterface } from '../../auth/interfaces/user-auth.interface';
import { GetDeliveryRoutesFilterDto } from '../dto/get-delivery-routes-filter.dto';

@Controller({ version: '1', path: 'delivery-routes' })
@Roles(Role.ADMIN)
@UseGuards(JwtAuthGuard)
export class DeliveryRoutesController {
  private logger = new Logger('DeliveryRoutesController');
  constructor(private readonly deliveryRoutesService: DeliveryRoutesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  createDeliveryRoute(
    @Body() createDeliveryRouteDto: CreateDeliveryRouteDto,
  ): Promise<DeliveryRoute> {
    return this.deliveryRoutesService.createDeliveryRoute(
      createDeliveryRouteDto,
    );
  }

  @Get()
  getDeliveryRoutes(
    @GetUser() user: UserAuthInterface,
    @Query() filterDto: GetDeliveryRoutesFilterDto,
  ): Promise<DeliveryRoute[]> {
    this.logger.verbose(`User "${user.given}" retrieving all deliveryRoutes`);
    return this.deliveryRoutesService.getDeliveryRoutes(filterDto);
  }

  @Get(':id')
  getDeliveryRouteById(@Param('id') id: number): Promise<DeliveryRoute> {
    return this.deliveryRoutesService.getDeliveryRouteById(+id);
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  updateDeliveryRoute(
    @Param('id') id: number,
    @Body() updateDeliveryRouteDto: UpdateDeliveryRouteDto,
  ): Promise<DeliveryRoute> {
    return this.deliveryRoutesService.updateDeliveryRoute(
      +id,
      updateDeliveryRouteDto,
    );
  }

  @Delete(':id')
  removeDeliveryRoute(@Param('id') id: number): Promise<void> {
    return this.deliveryRoutesService.removeDeliveryRoute(+id);
  }
}
