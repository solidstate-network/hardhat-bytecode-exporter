import type {
  BytecodeExporterConfig,
  BytecodeExporterConfigEntry,
  BytecodeExporterUserConfigEntry,
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

    const userConfigEntries = [
      userConfig.bytecodeExporter ??
        (DEFAULT_CONFIG as BytecodeExporterUserConfigEntry),
    ].flat();

    for (let i = 0; i < userConfigEntries.length; i++) {
      const userConfigEntry = userConfigEntries[i];

      if (userConfigEntry.flat && userConfigEntry.rename) {
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

    const userConfigEntries = [
      userConfig.bytecodeExporter ??
        (DEFAULT_CONFIG as BytecodeExporterUserConfigEntry),
    ].flat();

    for (const userConfigEntry of userConfigEntries) {
      const configEntry = {
        ...DEFAULT_CONFIG,
        ...userConfigEntry,
      };

      const rename =
        configEntry.rename ??
        (configEntry.flat
          ? (sourceName, contractName) => contractName
          : (sourceName, contractName) => path.join(sourceName, contractName));

      bytecodeExporter.push({
        ...configEntry,
        rename,
      });
    }

    return {
      ...(await next(userConfig, resolveConfigurationVariable)),
      bytecodeExporter,
    };
  },
});
