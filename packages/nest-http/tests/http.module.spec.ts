import { Global, Injectable, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";

import { ClientService } from "../src/client.service";
import { HttpModuleError } from "../src/http.error";
import { HttpModule } from "../src/http.module";
import {
  HttpModuleOptions,
  HttpModuleOptionsFactory,
} from "../src/http.module-options";
import { HttpService } from "../src/http.service";

describe("HttpModule", () => {
  it("boots successfully", async () => {
    const rootModule = await Test.createTestingModule({
      imports: [HttpModule.register()],
    }).compile();

    expect(rootModule.get(ClientService)).toBeDefined();
    expect(rootModule.get(HttpService)).toBeDefined();
  });

  it("boots successfully asynchronously via useClass", async () => {
    @Injectable()
    class ConfigService implements HttpModuleOptionsFactory {
      createHttpModuleOptions(): HttpModuleOptions {
        return {
          defaultRequestOptions: {
            maxRedirections: 0,
          },
        };
      }
    }

    @Module({
      providers: [ConfigService],
      exports: [ConfigService],
    })
    class ConfigModule {}

    const rootModule = await Test.createTestingModule({
      imports: [
        HttpModule.registerAsync({
          imports: [ConfigModule],
          useClass: ConfigService,
        }),
      ],
    }).compile();

    expect(rootModule.get(ClientService)).toBeDefined();
    expect(rootModule.get(HttpService)).toBeDefined();
  });

  it("boots successfully asynchronously via useClass from global module", async () => {
    @Injectable()
    class ConfigService implements HttpModuleOptionsFactory {
      createHttpModuleOptions(): HttpModuleOptions {
        return {
          defaultRequestOptions: {
            maxRedirections: 0,
          },
        };
      }
    }

    @Global()
    @Module({
      providers: [ConfigService],
      exports: [ConfigService],
    })
    class ConfigModule {}

    const rootModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        HttpModule.registerAsync({
          useClass: ConfigService,
        }),
      ],
    }).compile();

    expect(rootModule.get(ClientService)).toBeDefined();
    expect(rootModule.get(HttpService)).toBeDefined();
  });

  it("boots successfully asynchronously via useFactory", async () => {
    @Injectable()
    class ConfigService {
      public httpOptions: HttpModuleOptions = {
        defaultRequestOptions: {
          maxRedirections: 0,
        },
      };
    }

    @Module({
      providers: [ConfigService],
      exports: [ConfigService],
    })
    class ConfigModule {}

    const rootModule = await Test.createTestingModule({
      imports: [
        HttpModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (cfg: ConfigService) => cfg.httpOptions,
        }),
      ],
    }).compile();

    expect(rootModule.get(ClientService)).toBeDefined();
    expect(rootModule.get(HttpService)).toBeDefined();
  });

  it("boots successfully asynchronously via useFactory from global module", async () => {
    @Injectable()
    class ConfigService {
      public httpOptions: HttpModuleOptions = {
        defaultRequestOptions: {
          maxRedirections: 0,
        },
      };
    }

    @Global()
    @Module({
      providers: [ConfigService],
      exports: [ConfigService],
    })
    class ConfigModule {}

    const rootModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        HttpModule.registerAsync({
          inject: [ConfigService],
          useFactory: (cfg: ConfigService) => cfg.httpOptions,
        }),
      ],
    }).compile();

    expect(rootModule.get(ClientService)).toBeDefined();
    expect(rootModule.get(HttpService)).toBeDefined();
  });

  it("throws when neither useClass or useFactory are present", () => {
    const rootModuleFactory = () =>
      Test.createTestingModule({
        imports: [HttpModule.registerAsync({})],
      }).compile();

    expect(rootModuleFactory).toThrowError(HttpModuleError);
  });

  it("throws when both useClass and useFactory are present", () => {
    @Injectable()
    class ConfigFactory implements HttpModuleOptionsFactory {
      createHttpModuleOptions(): HttpModuleOptions {
        return {};
      }
    }

    @Injectable()
    class ConfigService {
      public authOptions: HttpModuleOptions = {};
    }

    @Module({
      providers: [ConfigFactory, ConfigService],
      exports: [ConfigFactory, ConfigService],
    })
    class ConfigModule {}

    const rootModuleFactory = () =>
      Test.createTestingModule({
        imports: [
          HttpModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useClass: ConfigFactory,
            useFactory: (cfg: ConfigService) => cfg.authOptions,
          }),
        ],
      }).compile();

    expect(rootModuleFactory).toThrowError(HttpModuleError);
  });
});
