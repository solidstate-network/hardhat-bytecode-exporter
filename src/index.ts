import pkg from '../package.json' with { type: 'json' };
import taskBytecode from './tasks/bytecode.js';
import taskBytecodeClean from './tasks/bytecode_clean.js';
import taskBytecodeExport from './tasks/bytecode_export.js';
import taskBytecodeInspect from './tasks/bytecode_inspect.js';
import taskClean from './tasks/clean.js';
import './type_extensions.js';
import { globalOption } from 'hardhat/config';
import { ArgumentType } from 'hardhat/types/arguments';
import type { HardhatPlugin } from 'hardhat/types/plugins';

// TODO: clean hook

const plugin: HardhatPlugin = {
  id: pkg.name!,
  npmPackage: pkg.name!,
  dependencies: () => [import('@solidstate/hardhat-solidstate-utils')],
  tasks: [
    taskBytecode,
    taskBytecodeClean,
    taskBytecodeExport,
    taskBytecodeInspect,
    taskClean,
  ],
  hookHandlers: {
    config: () => import('./hooks/config.js'),
    solidity: () => import('./hooks/solidity.js'),
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
