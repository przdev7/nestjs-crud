import { Global, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import Joi from "joi";
import { join } from "path";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../entities/user.entity";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "../common/guards/auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { UsersModule } from "../users/users.module";
import { CacheModule } from "@nestjs/cache-manager";

@Global()
@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        global: true,
        secret: config.getOrThrow("JWT_SECRET"),
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), ".env"),
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().default("development").valid("development", "production"),
        PORT_MAIN: Joi.number().port().default(3000),
        DB_NAME: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_PORT: Joi.number().port().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "postgres",
        port: config.getOrThrow("DB_PORT"),
        username: config.getOrThrow("DB_USERNAME"),
        password: config.getOrThrow("DB_PASSWORD"),
        database: config.getOrThrow("DB_NAME"),
        entities: [UserEntity],
      }),
    }),
    CacheModule.registerAsync({
      inject: [ConfigService],
      isGlobal: true,
      useFactory: () => ({}),
    }),
  ],

  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],

  exports: [JwtModule, TypeOrmModule, CacheModule],
})
export class CoreModule {}
