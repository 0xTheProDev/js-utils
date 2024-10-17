<!-- markdownlint-configure-file { "MD033": false } -->

# Nest Lock

[![Sponsor](https://img.shields.io/badge/sponsor-30363D?style=for-the-badge&logo=GitHub-Sponsors&logoColor=#white)](https://github.com/sponsors/0xTheProDev)
[![Node LTS](https://img.shields.io/node/v-lts/@theprodev/nest-lock?style=for-the-badge)](https://nodejs.org)
[![Npm Version](https://img.shields.io/npm/v/@theprodev/nest-lock?style=for-the-badge)](https://www.npmjs.com/package/@theprodev/nest-lock)
[![Weekly Downloads](https://img.shields.io/npm/dw/@theprodev/nest-lock?style=for-the-badge)](https://www.npmjs.com/package/@theprodev/nest-lock)
[![Dependents](https://img.shields.io/librariesio/dependents/npm/@theprodev/nest-lock?style=for-the-badge)](https://www.npmjs.com/package/@theprodev/nest-lock)
[![Minified Zipped Size](https://img.shields.io/bundlephobia/minzip/@theprodev/nest-lock?style=for-the-badge)](https://www.npmjs.com/package/@theprodev/nest-lock)
[![Code Coverage](https://img.shields.io/codecov/c/github/0xtheprodev/js-utils?style=for-the-badge&token=Y2LTY0MA2U)](https://codecov.io/github/0xTheProDev/js-utils)
[![Types](https://img.shields.io/npm/types/@theprodev/nest-lock?style=for-the-badge)](https://www.npmjs.com/package/@theprodev/nest-lock)
[![License](https://img.shields.io/github/license/0xTheProDev/js-utils?style=for-the-badge&label=license)](https://github.com/0xTheProDev/js-utils/blob/main/LICENSE)
[![Open Issues](https://img.shields.io/github/issues-raw/0xTheProDev/js-utils?style=for-the-badge)](https://github.com/0xTheProDev/js-utils/issues)
[![Closed Issues](https://img.shields.io/github/issues-closed-raw/0xTheProDev/js-utils?style=for-the-badge)](https://github.com/0xTheProDev/js-utils/issues?q=is%3Aissue+is%3Aclosed)
[![Open Pulls](https://img.shields.io/github/issues-pr-raw/0xTheProDev/js-utils?style=for-the-badge)](https://github.com/0xTheProDev/js-utils/pulls)
[![Closed Pulls](https://img.shields.io/github/issues-pr-closed-raw/0xTheProDev/js-utils?style=for-the-badge)](https://github.com/0xTheProDev/js-utils/pulls?q=is%3Apr+is%3Aclosed)
[![Contributors](https://img.shields.io/github/contributors/0xTheProDev/js-utils?style=for-the-badge)](https://github.com/0xTheProDev/js-utils/graphs/contributors)
[![Activity](https://img.shields.io/github/last-commit/0xTheProDev/js-utils?style=for-the-badge&label=most%20recent%20activity)](https://github.com/0xTheProDev/js-utils/pulse)

## Description

> A Redis-backed Lock Module for NestJS Applications.

Accessing a shared resource (e.g., Database Connections, Files, Load-constrained Services etc.) in the Distributed Workloads, Horizontal Scaling and Microservices, we often have to execute the request in a Mutual Exclusion zone. The required Locking Mechanism needs to be distributed in nature and accessible from each service, i.e., it cannot live within a Process Map or In-memory of a running instance. This module aims to simplify acquiring and releasing such Locking Mechanism with ease for Nest Applications in Web Backend.

## Installation

Install this package using your preferred package manager. See the example of [yarn](https://yarnpkg.com):

```sh
yarn add @theprodev/nest-lock
```

## Usage

Most common usage entails defining and configuring the `LockModule` using a predefined global module `ConfigModule` and use appropriate configuration options to pass on to this module.

- In `app.module.ts`:

  ```ts
  import { LockModule } from "@theprodev/nest-lock";

  @Module({
    imports: [
      LockModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (cfg: ConfigService) => cfg.lockOptions,
      }),
    ],
  })
  export class AppModule {}
  ```

- In `app.service.ts`:

  ```ts
  import { InjectLock, Lock } from "@theprodev/nest-lock";

  @Injectable()
  export class AppService {
    constructor(
      private readonly httpService: HttpService,
      @InjectLock() private readonly lock: Lock,
    ) {}

    async getHello(): Promise<string> {
      try {
        return await this.lock.execute("appService", () => "Hello World!", {
          ttl: 1000,
        });
      } catch (err) {
        console.log((err as any).cause);
        return "Bye World!";
      }
    }
  }
  ```

For any further usage, refer to the [Type Declaration](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html) shipped with the package. Make sure your editor or IDE is capable of powering intellisense from the declaration file provided.

## Testing

- To run all the unit test suites, run the following after all the dependencies have been installed:

```sh
yarn test
```

- To collect coverage on the tested files, execute the following command:

```sh
yarn test:cov
```

## Reporting a Bug

Head on to [**Discussion**](https://github.com/0xTheProDev/js-utils/discussions) section to report a bug or to ask for any feature. Feel to add your queries about using this library as well under _Q & A_ section of it. Remember, do not create any Issues by yourself, maintainers of this repository will open one if deemed necessary.

## Changelog

See [CHANGELOG](CHANGELOG.md) for more details on what has been changed in the latest release.

## Contributing

See [Contributing Guidelines](../../.github/CONTRIBUTING.md).

## License

This project is licensed under the terms of the MIT license, see [LICENSE](LICENSE) for more details.

<a href="https://github.com/0xTheProDev">
  <img src=".github/assets/the-pro-dev-original.png" alt="The Pro Dev" height="120" width="120"/>
</a>
