# Hardhat Bytecode Exporter

Export Ethereum smart contract bytecode on compilation via Hardhat.

## Installation

```bash
yarn add --dev @solidstate/hardhat-bytecode-exporter
```

## Usage

Load plugin in Hardhat config:

```javascript
require('@solidstate/hardhat-bytecode-exporter');
```

Add configuration under the `bytecodeExporter` key:

| option | description | default |
|-|-|-|
| `path` | path to ABI export directory (relative to Hardhat root) | `'./abi'` |
| `runOnCompile` | whether to automatically export ABIs during compilation | `false` |
| `clear` | whether to delete old ABI files in `path` on compilation | `false` |
| `flat` | whether to flatten output directory (may cause name collisions) | `false` |
| `only` | `Array` of `String` matchers used to select included contracts, defaults to all contracts if `length` is 0 | `[]` |
| `except` | `Array` of `String` matchers used to exclude contracts | `[]` |
| `spacing` | number of spaces per indentation level of formatted output | `2` |
| `rename` | `Function` with signature `(sourceName: string, contractName: string) => string` used to rename an exported ABI (incompatible with `flat` option) | `undefined` |

 Note that the configuration formatted as either a single `Object`, or an `Array` of objects.  An `Array` may be used to specify multiple outputs.

```javascript
bytecodeExporter: {
  path: './data/abi',
  runOnCompile: true,
  clear: true,
  flat: true,
  only: [':ERC20$'],
  spacing: 2,
}
```

The included Hardhat tasks may be run manually:

```bash
yarn run hardhat export-bytecode
yarn run hardhat clear-bytecode
```

By default, the hardhat `compile` task is run before exporting bytecode.  This behavior can be disabled with the `--no-compile` flag:

```bash
yarn run hardhat export-bytecode --no-compile
```


The `path` directory will be created if it does not exist.

The `clear` option is set to `false` by default because it represents a destructive action, but should be set to `true` in most cases.

Bytecode files are saved in the format `[CONTRACT_NAME].json`.
