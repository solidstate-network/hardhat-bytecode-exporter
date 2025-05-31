import pkg from '../package.json' with { type: 'json' };
import taskClean from './tasks/clean.js';
import taskClearBytecode from './tasks/clear_bytecode.js';
import taskExportBytecode from './tasks/export_bytecode.js';
import './type_extensions.js';
import { globalOption } from 'hardhat/config';
import { ArgumentType } from 'hardhat/types/arguments';
import type { HardhatPlugin } from 'hardhat/types/plugins';

// TODO: clean hook

const plugin: HardhatPlugin = {
  id: pkg.name!,
  npmPackage: pkg.name!,
  dependencies: [
    async () => {
      const { default: HardhatSolidstateUtils } = await import(
        '@solidstate/hardhat-solidstate-utils'
      );
      return HardhatSolidstateUtils;
    },
  ],
  tasks: [taskClearBytecode, taskExportBytecode, taskClean],
  hookHandlers: {
    config: import.meta.resolve('./hooks/config.js'),
    solidity: import.meta.resolve('./hooks/solidity.js'),
  },
  globalOptions: [
    globalOption({
      name: 'noExportBytecode',
      description: 'Disables bytecode exporting',
      defaultValue: false,
      type: ArgumentType.BOOLEAN,
    }),
  ],
};

export default plugin;
