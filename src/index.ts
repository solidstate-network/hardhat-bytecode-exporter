import { name as pluginName } from '../package.json';
import './tasks/clear_bytecode';
import './tasks/compile';
import './tasks/export_bytecode';
import { extendConfig } from 'hardhat/config';
import { HardhatPluginError } from 'hardhat/plugins';
import 'hardhat/types/config';
import path from 'path';

interface BytecodeExporterUserConfigEntry {
  path?: string;
  runOnCompile?: boolean;
  clear?: boolean;
  flat?: boolean;
  only?: string[];
  except?: string[];
  rename?: (sourceName: string, contractName: string) => string;
}

interface BytecodeExporterConfigEntry {
  path: string;
  runOnCompile: boolean;
  clear: boolean;
  flat: boolean;
  only: string[];
  except: string[];
  rename: (sourceName: string, contractName: string) => string;
}

declare module 'hardhat/types/config' {
  interface HardhatUserConfig {
    bytecodeExporter?:
      | BytecodeExporterUserConfigEntry
      | BytecodeExporterUserConfigEntry[];
  }

  interface HardhatConfig {
    bytecodeExporter: BytecodeExporterConfigEntry[];
  }
}

const DEFAULT_CONFIG = {
  path: './bytecode',
  runOnCompile: false,
  clear: false,
  flat: false,
  only: [],
  except: [],
  // `rename` is not defaulted as it may depend on `flat` option
};

function validate(
  config: BytecodeExporterUserConfigEntry,
  key: keyof BytecodeExporterUserConfigEntry,
  type: string,
) {
  if (type === 'array') {
    if (!Array.isArray(config[key])) {
      throw new HardhatPluginError(
        pluginName,
        `\`${key}\` config must be an ${type}`,
      );
    }
  } else {
    if (typeof config[key] !== type) {
      throw new HardhatPluginError(
        pluginName,
        `\`${key}\` config must be a ${type}`,
      );
    }
  }
}

extendConfig(function (config, userConfig) {
  config.bytecodeExporter = [userConfig.bytecodeExporter].flat().map((el) => {
    const conf: BytecodeExporterUserConfigEntry = Object.assign(
      {},
      DEFAULT_CONFIG,
      el,
    );
    validate(conf, 'path', 'string');
    validate(conf, 'runOnCompile', 'boolean');
    validate(conf, 'clear', 'boolean');
    validate(conf, 'flat', 'boolean');
    validate(conf, 'only', 'array');
    validate(conf, 'except', 'array');

    if (conf.flat && typeof conf.rename !== 'undefined') {
      throw new HardhatPluginError(
        pluginName,
        '`flat` & `rename` config cannot be specified together',
      );
    }

    if (conf.flat) {
      conf.rename = (_, contractName) => contractName;
    }

    if (!conf.rename) {
      conf.rename = (sourceName, contractName) =>
        path.join(sourceName, contractName);
    }

    validate(conf, 'rename', 'function');

    return conf as BytecodeExporterConfigEntry;
  });
});
