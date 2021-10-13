import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../user/repositories/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthLoginDto } from './dto/auth-login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(loginDto: AuthLoginDto): Promise<any> {
    const { rut, password } = loginDto;
    const user = await this.userRepository.findOne({ rut });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const payload = { name: user.given, sub: user.id, role: user.role };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
