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
import { ListUsersDto } from '../dto/list-users.dto';
import { ResponseUserDTO } from '../dto/response-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
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

  async register(data: CreateUserDto, createdBy?: UserEntity) {
    try {
      const hashedPassword = await hash(data.password, 10);
      const user = await this.repo.save({
        ...data,
        password: hashedPassword,
        status: StatusUser.PENDING,
        metadata: {
          createdBy: createdBy ? createdBy.email : null,
        },
      });
      return this.createToken(user);
    } catch (err) {
      this.logger.error(`[CREATE USER ERROR]: ${JSON.stringify(err)}`);
      throw new BadRequestException('Email is already registered');
    }
  }

  async update(user: UserEntity, data: UpdateUserDto) {
    delete (data as any).email;

    if (data.password) {
      data.password = await hash(data.password, 10);
    }

    const updatedUser = this.repo.merge(user, data);

    try {
      return await this.repo.save(updatedUser);
    } catch (err) {
      this.logger.error(`[UPDATE USER ERROR]: ${JSON.stringify(err)}`);
      throw new BadRequestException(`Error updating user: ${err.message}`);
    }
  }

  async list(paginate: { limit: number; page: number }, query: ListUsersDto) {
    const { limit, page } = paginate;
    const skip = (page - 1) * limit;

    try {
      const [users, total] = await this.repo.findAndCount({
        where: {
          ...query,
        },
        skip,
        take: limit,
        order: { createdAt: 'DESC' },
      });

      return { page, limit, users, totalUsers: total };
    } catch (err) {
      this.logger.error(`[LIST USER ERROR]: ${JSON.stringify(err)}`);
      throw new BadRequestException(`Error listing users: ${err.message}`);
    }
  }

  async remove(data: UserEntity) {
    try {
      await this.repo.softDelete(data.id);
    } catch (err) {
      this.logger.error(`[REMOVE USER ERROR]: ${JSON.stringify(err)}`);
      throw new BadRequestException(`Error removing user: ${err.message}`);
    }
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
      user: new ResponseUserDTO(user),
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
