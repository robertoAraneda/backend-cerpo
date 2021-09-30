import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from '../users/repositories/users.repository';
import { InjectRepository } from '@nestjs/typeorm';

import * as config from 'config';

const jwtConfig = config.get('jwt');

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UsersRepository)
    private readonly userRepository: UsersRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      //ignoreExpiration: false,
      secretOrKey: jwtConfig.secret,
    });
  }

  async validate(payload: any) {
    const { sub } = payload;

    const user = await this.userRepository.findOne(sub);

    if (!user) throw new UnauthorizedException();

    const { id, given, fatherFamily, motherFamily, role } = user;

    return { id, given, fatherFamily, motherFamily, role };
  }
}
