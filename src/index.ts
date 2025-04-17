import pkg from '../package.json';
import './tasks/clear_bytecode';
import './tasks/compile';
import './tasks/export_bytecode';
import type {
  BytecodeExporterConfigEntry,
  BytecodeExporterUserConfigEntry,
} from './types.js';
import { extendConfig } from 'hardhat/config';
import { HardhatPluginError } from 'hardhat/plugins';
import 'hardhat/types/config';
import type { HardhatPlugin } from 'hardhat/types/plugins';
import path from 'path';

const DEFAULT_CONFIG = {
  path: './bytecode',
  runOnCompile: false,
  clear: false,
  flat: false,
  only: [],
  except: [],
  // `rename` is not defaulted as it may depend on `flat` option
};

extendConfig((config, userConfig) => {
  config.bytecodeExporter = [userConfig.bytecodeExporter].flat().map((el) => {
    const conf: BytecodeExporterUserConfigEntry = Object.assign(
      {},
      DEFAULT_CONFIG,
      el,
    );

    if (conf.flat && conf.rename) {
      throw new HardhatPluginError(
        pkg.name,
        '`flat` & `rename` config cannot be specified together',
      );
    }

    if (conf.flat) {
      conf.rename = (sourceName, contractName) => contractName;
    }

    if (!conf.rename) {
      conf.rename = (sourceName, contractName) =>
        path.join(sourceName, contractName);
    }

    return conf as BytecodeExporterConfigEntry;
  });
});

const plugin: HardhatPlugin = {
  id: pkg.name!,
  npmPackage: pkg.name!,
};

export default plugin;
