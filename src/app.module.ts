import { Module, OnApplicationBootstrap, Scope } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  APP_GUARD,
  APP_INTERCEPTOR,
  ModulesContainer,
  Reflector,
} from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';

import { SnakeNamingStrategy } from '@Common/snake-naming.strategy';
import { AuthModule } from '@Modules/blog/auth/auth.module';
import { PostModule } from '@Modules/blog/post/post.module';
import { StatusModule } from '@Modules/status/status.module';
import { InnerAuthorizeGuard } from '@Shared/guards/inner.authorize.guard';
import { ClassSerializerGuardInterceptor } from '@Shared/interceptors/class.serializer.interceptor';

@Module({
  imports: [
    StatusModule,
    AuthModule,
    PostModule,
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: {
                  singleLine: true,
                  colorize: true,
                  translateTime: 'SYS:standard',
                  ignore: 'pid,hostname',
                },
              }
            : undefined,
      },
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get('DB_PORT'),
        username: config.get('DB_USER'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false,
        namingStrategy: new SnakeNamingStrategy(),
        ssl: {
          rejectUnauthorized: false,
        },
      }),
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerGuardInterceptor,
    },
    {
      provide: APP_GUARD,
      scope: Scope.REQUEST,
      useClass: InnerAuthorizeGuard,
    },
  ],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(
    private configService: ConfigService,
    private readonly modulesContainer: ModulesContainer,
    private readonly reflector: Reflector,
  ) {}

  onApplicationBootstrap() {}
}
