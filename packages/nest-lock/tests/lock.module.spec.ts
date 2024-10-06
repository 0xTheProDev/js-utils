import { Global, Injectable, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";

import { LockModuleError } from "../src/lock.error";
import { LockModule } from "../src/lock.module";
import {
  LockModuleOptions,
  LockModuleOptionsFactory,
} from "../src/lock.module-options";
import { LOCK } from "../src/lock.provider-tokens";

describe("LockModule", () => {
  it("boots successfully", async () => {
    const rootModule = await Test.createTestingModule({
      imports: [
        LockModule.forRoot({
          config: {
            host: "redis://example.com",
          },
        }),
      ],
    }).compile();

    expect(rootModule.get(LOCK)).toBeDefined();
  });

  it("boots successfully asynchronously via useClass", async () => {
    @Injectable()
    class ConfigService implements LockModuleOptionsFactory {
      createLockModuleOptions(): LockModuleOptions {
        return {
          config: {
            host: "redis://example.com",
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
        LockModule.forRootAsync({
          imports: [ConfigModule],
          useClass: ConfigService,
        }),
      ],
    }).compile();

    expect(rootModule.get(LOCK)).toBeDefined();
  });

  it("boots successfully asynchronously via useClass from global module", async () => {
    @Injectable()
    class ConfigService implements LockModuleOptionsFactory {
      createLockModuleOptions(): LockModuleOptions {
        return {
          config: {
            host: "redis://example.com",
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
        LockModule.forRootAsync({
          useClass: ConfigService,
        }),
      ],
    }).compile();

    expect(rootModule.get(LOCK)).toBeDefined();
  });

  it("boots successfully asynchronously via useFactory", async () => {
    @Injectable()
    class ConfigService {
      public lockOptions: LockModuleOptions = {
        config: {
          host: "redis://example.com",
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
        LockModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (cfg: ConfigService) => cfg.lockOptions,
        }),
      ],
    }).compile();

    expect(rootModule.get(LOCK)).toBeDefined();
  });

  it("boots successfully asynchronously via useFactory from global module", async () => {
    @Injectable()
    class ConfigService {
      public lockOptions: LockModuleOptions = {
        config: {
          host: "redis://example.com",
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
        LockModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (cfg: ConfigService) => cfg.lockOptions,
        }),
      ],
    }).compile();

    expect(rootModule.get(LOCK)).toBeDefined();
  });

  it("throws when neither useClass or useFactory are present", () => {
    const rootModuleFactory = () =>
      Test.createTestingModule({
        imports: [LockModule.forRootAsync({})],
      }).compile();

    expect(rootModuleFactory).toThrowError(LockModuleError);
  });

  it("throws when both useClass and useFactory are present", () => {
    @Injectable()
    class ConfigFactory implements LockModuleOptionsFactory {
      createLockModuleOptions(): LockModuleOptions {
        return {
          config: {
            host: "redis://example.com",
          },
        };
      }
    }

    @Injectable()
    class ConfigService {
      public lockOptions: LockModuleOptions = {
        config: {
          host: "redis://example.com",
        },
      };
    }

    @Module({
      providers: [ConfigFactory, ConfigService],
      exports: [ConfigFactory, ConfigService],
    })
    class ConfigModule {}

    const rootModuleFactory = () =>
      Test.createTestingModule({
        imports: [
          LockModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useClass: ConfigFactory,
            useFactory: (cfg: ConfigService) => cfg.lockOptions,
          }),
        ],
      }).compile();

    expect(rootModuleFactory).toThrowError(LockModuleError);
  });
});
