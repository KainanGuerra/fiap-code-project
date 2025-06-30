import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { hash, compare } from 'bcrypt';
import { Repository } from 'typeorm';

import { AuthRoles } from '@Shared/constants/auth.roles.constant';

import { UserEntity } from '../user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(data: { email: string; password: string; role: AuthRoles }) {
    const hashedPassword = await hash(data.password, 10);
    const user = this.repo.create({ ...data, password: hashedPassword });
    await this.repo.save(user);
    return this.createToken(user);
  }

  async login(email: string, password: string) {
    const user = await this.repo.findOneBy({ email });
    if (!user || !(await compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.createToken(user);
  }

  private createToken(user: UserEntity) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }

  async authenticateToken(headers: Record<string, any>, expectedType: 'user') {
    const authHeader = headers['authorization'];
    if (!authHeader?.startsWith('Bearer ')) throw new UnauthorizedException();

    const token = authHeader.split(' ')[1];
    const payload = this.jwtService.verify(token, {
      secret: this.configService.getOrThrow('JWT_SECRET'),
    });

    return {
      user: payload,
    };
  }
}
