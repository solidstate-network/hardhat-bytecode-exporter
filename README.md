# Hardhat Bytecode Exporter

Export Ethereum smart contract bytecode on compilation via Hardhat.

## Installation

```bash
npm install --save-dev @solidstate/hardhat-bytecode-exporter
# or
yarn add --dev @solidstate/hardhat-bytecode-exporter
```

## Usage

Load plugin in Hardhat config:

```javascript
require("@solidstate/hardhat-bytecode-exporter");
```

Add configuration under the `bytecodeExporter` key:

| option         | description                                                                                                                                            | default        |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------- |
| `path`         | path to bytecode export directory (relative to Hardhat root)                                                                                           | `'./bytecode'` |
| `runOnCompile` | whether to automatically export bytecode during compilation                                                                                            | `false`        |
| `clear`        | whether to delete old bytecode files in `path` on compilation                                                                                          | `false`        |
| `flat`         | whether to flatten output directory (may cause name collisions)                                                                                        | `false`        |
| `only`         | `Array` of `String` matchers used to select included contracts, defaults to all contracts if `length` is 0                                             | `[]`           |
| `except`       | `Array` of `String` matchers used to exclude contracts                                                                                                 | `[]`           |
| `rename`       | `Function` with signature `(sourceName: string, contractName: string) => string` used to rename an exported bytecode (incompatible with `flat` option) | `undefined`    |

Note that the configuration formatted as either a single `Object`, or an `Array` of objects. An `Array` may be used to specify multiple outputs.

```javascript
bytecodeExporter: {
  path: './data',
  runOnCompile: true,
  clear: true,
  flat: true,
  only: [':ERC20$'],
}

// or

bytecodeExporter: [
  {
    path: './only',
    runOnCompile: true,
    only: [':ERC20$'],
  },
  {
    path: './except',
    except: [':ERC20$'],
  },
]
```

The included Hardhat tasks may be run manually:

```bash
npx hardhat export-bytecode
npx hardhat clear-bytecode
# or
yarn run hardhat export-bytecode
yarn run hardhat clear-bytecode
```

By default, the hardhat `compile` task is run before exporting bytecode. This behavior can be disabled with the `--no-compile` flag:

```bash
npx hardhat export-bytecode --no-compile
# or
yarn run hardhat export-bytecode --no-compile
```

The `path` directory will be created if it does not exist.

The `clear` option is set to `false` by default because it represents a destructive action, but should be set to `true` in most cases.

Bytecode files are saved as a flat bin file in the format `[CONTRACT_NAME].bin`.

## Development

Install dependencies via Yarn:

```bash
yarn install
```

Setup Husky to format code on commit:

```bash
yarn prepare
```
