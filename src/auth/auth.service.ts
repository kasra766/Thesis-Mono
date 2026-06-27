import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.prisma.auth.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (exists) throw new BadRequestException('Email already exists');

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const auth = await this.prisma.auth.create({
      data: {
        email: dto.email,
        passwordHash,
      },
    });

    await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        authId: auth.id,
      },
    });

    return {
      message: 'User created',
    };
  }

  async login(dto: LoginDto) {
    const auth = await this.prisma.auth.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!auth) throw new UnauthorizedException();

    const valid = await bcrypt.compare(dto.password, auth.passwordHash);

    if (!valid) throw new UnauthorizedException();

    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new UnauthorizedException();
    const payload = {
      sub: auth.id,
      userId: user.id,
      email: auth.email,
      role: auth.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
