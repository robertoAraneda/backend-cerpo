import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDeliveryRouteDto {
  @IsNotEmpty() @IsString() name: string;
}
