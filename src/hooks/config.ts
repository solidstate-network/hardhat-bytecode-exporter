import type {
  BytecodeExporterConfig,
  BytecodeExporterConfigEntry,
} from '../types.js';
import type {
  ConfigHooks,
  HardhatUserConfigValidationError,
} from 'hardhat/types/hooks';
import path from 'node:path';

const DEFAULT_CONFIG: Omit<BytecodeExporterConfigEntry, 'rename'> = {
  path: './bytecode',
  runOnCompile: false,
  clear: false,
  flat: false,
  only: [],
  except: [],
  // `rename` is not defaulted as it may depend on `flat` option
};

export default async (): Promise<Partial<ConfigHooks>> => ({
  validateUserConfig: async (userConfig) => {
    const errors: HardhatUserConfigValidationError[] = [];

    const configEntries = [userConfig.bytecodeExporter ?? []].flat();

    for (let i = 0; i < configEntries.length; i++) {
      const entry = configEntries[i];

      if (entry.flat && entry.rename) {
        errors.push({
          path: ['bytecodeExporter', i, 'flat'],
          message: '`flat` & `rename` config cannot be specified together',
        });
      }
    }

    // remove the config entry index if the user config is not an array

    if (!Array.isArray(userConfig.bytecodeExporter)) {
      for (const error of errors) {
        error.path.splice(1, 1);
      }
    }

    return errors;
  },

  resolveUserConfig: async (userConfig, resolveConfigurationVariable, next) => {
    const bytecodeExporter: BytecodeExporterConfig = [];

    for (const userConfigEntry of [userConfig.bytecodeExporter ?? []].flat()) {
      const entry = {
        ...DEFAULT_CONFIG,
        ...userConfigEntry,
      };

      const rename =
        entry.rename ??
        (entry.flat
          ? (sourceName, contractName) => contractName
          : (sourceName, contractName) => path.join(sourceName, contractName));

      bytecodeExporter.push({
        ...entry,
        rename,
      });
    }

    return {
      ...(await next(userConfig, resolveConfigurationVariable)),
      bytecodeExporter,
    };
  },
});
