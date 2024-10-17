import { HttpModule } from "@theprodev/nest-http";
import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "./config/config.module";
import { ConfigService } from "./config/config.service";
import { LockModule } from "@theprodev/nest-lock";

@Module({
  imports: [
    ConfigModule,
    HttpModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        defaultRequestOptions: {
          bodyTimeout: config.getMaxTimeout(),
          maxRedirections: config.getMaxRedirections(),
        },
      }),
    }),
    LockModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        config: {
          host: config.getRedisHost(),
          port: config.getRedisPort(),
          lazyConnect: false,
        },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
