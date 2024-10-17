import { Injectable } from "@nestjs/common";

@Injectable()
export class ConfigService {
  appId() {
    return "nest-example-app" as const;
  }

  appName() {
    return "NestExample" as const;
  }

  appNamespace() {
    return "ExampleNamespace" as const;
  }

  appSecret() {
    return "xxxxxx-xxxx-xxxx-xxxx" as const;
  }

  env() {
    return process.env["NODE_ENV"] ?? "development";
  }

  getMaxRedirections() {
    return 0 as const;
  }

  getMaxTimeout() {
    return 5000 as const;
  }

  getRedisHost() {
    return "localhost" as const;
  }

  getRedisPort() {
    return 6379 as const;
  }
}
