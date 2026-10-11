# React Hooks

[![Sponsor](https://img.shields.io/badge/sponsor-30363D?style=for-the-badge&logo=GitHub-Sponsors&logoColor=white)](https://github.com/sponsors/0xTheProDev)
[![Node LTS](https://img.shields.io/node/v-lts/@theprodev/react-hooks?style=for-the-badge)](https://nodejs.org)
[![Npm Version](https://img.shields.io/npm/v/@theprodev/react-hooks?style=for-the-badge)](https://www.npmjs.com/package/@theprodev/react-hooks)
[![Weekly Downloads](https://img.shields.io/npm/dw/@theprodev/react-hooks?style=for-the-badge)](https://www.npmjs.com/package/@theprodev/react-hooks)
[![Dependents](https://img.shields.io/librariesio/dependents/npm/@theprodev/react-hooks?style=for-the-badge)](https://www.npmjs.com/package/@theprodev/react-hooks)
[![Minified Zipped Size](https://img.shields.io/bundlephobia/minzip/@theprodev/react-hooks?style=for-the-badge)](https://www.npmjs.com/package/@theprodev/react-hooks)
[![Code Coverage](https://img.shields.io/codecov/c/github/0xtheprodev/js-utils?style=for-the-badge&token=Y2LTY0MA2U)](https://codecov.io/github/0xTheProDev/js-utils)
[![Types](https://img.shields.io/npm/types/@theprodev/react-hooks?style=for-the-badge)](https://www.npmjs.com/package/@theprodev/react-hooks)
[![License](https://img.shields.io/github/license/0xTheProDev/js-utils?style=for-the-badge&label=license)](https://github.com/0xTheProDev/js-utils/blob/main/LICENSE)
[![Open Issues](https://img.shields.io/github/issues-raw/0xTheProDev/js-utils?style=for-the-badge)](https://github.com/0xTheProDev/js-utils/issues)
[![Closed Issues](https://img.shields.io/github/issues-closed-raw/0xTheProDev/js-utils?style=for-the-badge)](https://github.com/0xTheProDev/js-utils/issues?q=is%3Aissue+is%3Aclosed)
[![Open Pulls](https://img.shields.io/github/issues-pr-raw/0xTheProDev/js-utils?style=for-the-badge)](https://github.com/0xTheProDev/js-utils/pulls)
[![Closed Pulls](https://img.shields.io/github/issues-pr-closed-raw/0xTheProDev/js-utils?style=for-the-badge)](https://github.com/0xTheProDev/js-utils/pulls?q=is%3Apr+is%3Aclosed)
[![Contributors](https://img.shields.io/github/contributors/0xTheProDev/js-utils?style=for-the-badge)](https://github.com/0xTheProDev/js-utils/graphs/contributors)
[![Activity](https://img.shields.io/github/last-commit/0xTheProDev/js-utils?style=for-the-badge&label=most%20recent%20activity)](https://github.com/0xTheProDev/js-utils/pulse)

## Description

> A collection of reusable React hooks for common state, lifecycle, callback, and browser API tasks.

`@theprodev/react-hooks` provides small, focused hooks that can be composed into React components:

- `usePreviousState` tracks the state value from the previous committed render.
- `useConsistentCallback` returns a callback with stable identity that invokes the latest committed callback.
- `useIsMounted` returns a stable check for whether the component is currently mounted.
- `useBattery` exposes battery status when the browser supports the Battery Status API.
- `useIsomorphicInsertionEffect` uses an insertion effect in the browser and an effect during server rendering.

## Installation

Install this package using your preferred package manager. See the example of [yarn](https://yarnpkg.com):

```sh
yarn add @theprodev/react-hooks
```

React and React DOM are peer dependencies and must also be installed in your application.

## Usage

Import the hooks you need from the package. For example, `usePreviousState` tracks the value from the previous committed render:

```tsx
import { usePreviousState } from "@theprodev/react-hooks";

export function Counter() {
  const [count, setCount, previousCount] = usePreviousState(0);

  return (
    <section>
      <p>Current count: {count}</p>
      <p>Previous count: {previousCount ?? "None"}</p>
      <button onClick={() => setCount((current) => current + 1)}>
        Increase
      </button>
    </section>
  );
}
```

`usePreviousState` returns a tuple of `[currentState, setState, previousState]`. The previous value is `undefined` until the state changes.

### Battery status

`useBattery` returns `battery`, `error`, `loading`, and `supported` values:

```tsx
import { useBattery } from "@theprodev/react-hooks";

export function BatteryStatus() {
  const { battery, error, loading, supported } = useBattery();

  if (!supported) return <p>Battery status is not supported.</p>;
  if (loading) return <p>Loading battery status...</p>;
  if (error) return <p>Could not read battery status.</p>;
  if (!battery) return null;

  return <p>Battery level: {Math.round(battery.level * 100)}%</p>;
}
```

Battery information depends on browser support and availability of the Battery Status API. It may not be available in every browser or execution environment.

For complete signatures and return types, see the TypeScript declarations included with the package.

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

Head on to [**Discussion**](https://github.com/0xTheProDev/js-utils/discussions) section to report a bug or to ask for any feature. Feel free to add your queries about using this library as well under _Q & A_ section of it. Remember, do not create any Issues by yourself; maintainers of this repository will open one if deemed necessary.

## Changelog

See [CHANGELOG](CHANGELOG.md) for more details on what has been changed in the latest release.

## Contributing

See the [Contributing Guidelines](../../.github/CONTRIBUTING.md).

## License

This project is licensed under the terms of the MIT license, see [LICENSE](../../LICENSE) for more details.

<a href="https://github.com/0xTheProDev">
  <img src="../../.github/assets/the-pro-dev-original.png" alt="The Pro Dev" height="120" width="120"/>
</a>
