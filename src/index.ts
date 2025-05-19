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
  includeDeployed?: boolean;
  clear?: boolean;
  flat?: boolean;
  only?: string[];
  except?: string[];
  rename?: (sourceName: string, contractName: string) => string;
}

export interface BytecodeExporterConfigEntry {
  path: string;
  runOnCompile: boolean;
  includeDeployed: boolean;
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
  includeDeployed: false,
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
        pluginName,
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
