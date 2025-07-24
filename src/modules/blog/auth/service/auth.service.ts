import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { hash, compare } from 'bcrypt';
import { Logger } from 'nestjs-pino';
import { Repository } from 'typeorm';

import { InternalUserInformation } from '@Shared/interfaces/auth.interface';

import { StatusUser } from '../costants/status.user';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserEntity } from '../user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {}

  async register(data: CreateUserDto) {
    try {
      const hashedPassword = await hash(data.password, 10);
      const user = await this.repo.save({
        ...data,
        password: hashedPassword,
        status: StatusUser.PENDING,
      });
      console.debug(user);
      return this.createToken(user);
    } catch (err) {
      this.logger.error(`[CREATE USER ERROR]: ${JSON.stringify(err)}`);
      throw new BadRequestException('Email is already registered');
    }
  }

  list() {
    return this.repo.find();
  }

  async remove(data: UserEntity) {
    await this.repo.softDelete(data.id);
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
      accessToken: this.jwtService.sign(
        payload,
        // TIP: can set jwt token expiration time here or on jwt auth module
        //{ expiresIn: '15m' }
      ),
      user,
    };
  }

  async authenticateToken(headers: Record<string, any>) {
    const authHeader = headers['authorization'];
    if (!authHeader?.startsWith('Bearer ')) throw new UnauthorizedException();

    const token = authHeader.split(' ')[1];
    const payload: InternalUserInformation = this.jwtService.verify(token, {
      secret: this.configService.getOrThrow('JWT_SECRET'),
    });
    const user = await this.repo.findOneByOrFail({ email: payload.email });

    return {
      user,
    };
  }
}
