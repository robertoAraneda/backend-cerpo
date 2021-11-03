import { Injectable, Logger } from '@nestjs/common';
import * as qs from 'qs';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { CacheService } from '../../cache/services/cache.service';
import { GetApiPersonaDto } from '../dto/get-api-persona.dto';
import { Cache } from '../../cache/entities/cache.entity';
import * as dayjs from 'dayjs';

const timeout = 1000 * 5;

@Injectable()
export class ApiPersonaService {
  private logger = new Logger('ApiPersonaService');

  API_PERSONAS_URL = this.configService.get<string>('API_PERSONAS_URL');
  API_PERSONAS_SECRET = this.configService.get<string>('API_PERSONAS_SECRET');
  constructor(
    private configService: ConfigService,
    private readonly cacheService: CacheService,
  ) {}

  async getTokenApi() {
    this.logger.verbose('consultando token');
    const url = `${this.API_PERSONAS_URL}/oauth/token`;

    const data = qs.stringify({ grant_type: 'client_credentials' });

    const config = {
      headers: {
        Authorization: this.API_PERSONAS_SECRET,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    const response = await axios.post(url, data, config);

    return response.data;
  }

  async getPersonInfo(filterDto: GetApiPersonaDto) {
    const { rut } = filterDto;
    const [correlative, dv] = rut.split('-');

    const url = `${this.API_PERSONAS_URL}/v2/personas/datos/basicos/run?runPersona=${correlative}&dvPersona=${dv}`;

    try {
      const token: string = await this.getToken();

      const response = await axios.get(url, {
        timeout,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (e) {
      this.logger.verbose(e);
      console.log(e);
    }
  }

  protected async getToken() {
    let cachedToken: Cache = await this.cacheService.findTokenByType('Bearer');

    if (!cachedToken) {
      const { expires_in, access_token, token_type } = await this.getTokenApi();

      cachedToken = await this.cacheService.create({
        expiresIn: expires_in,
        value: access_token,
        type: token_type,
      });
    }

    const { updatedAt, id, value, expiresIn } = cachedToken;

    const isExpired: boolean = ApiPersonaService.isTokenExpired(
      updatedAt,
      expiresIn,
    );

    if (isExpired) {
      const { expires_in, access_token, token_type } = await this.getTokenApi();

      await this.cacheService.update(id, {
        expiresIn: expires_in,
        value: access_token,
        type: token_type,
      });

      return access_token; //se retorna el valor del token entregado por api personas
    }

    return value; //se retorna el valor del token almacenado en cache
  }

  protected static isTokenExpired(date, expiresIn): boolean {
    const currentDate = dayjs();
    const tokenDate = dayjs(date);

    const diff = currentDate.diff(tokenDate, 'second');

    return diff > expiresIn;
  }
}
