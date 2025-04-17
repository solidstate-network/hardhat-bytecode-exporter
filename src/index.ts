import pkg from '../package.json';
import './tasks/clear_bytecode';
import './tasks/compile';
import './tasks/export_bytecode';
import { globalOption } from 'hardhat/config';
import { ArgumentType } from 'hardhat/types/arguments';
import 'hardhat/types/config';
import type { HardhatPlugin } from 'hardhat/types/plugins';

const plugin: HardhatPlugin = {
  id: pkg.name!,
  npmPackage: pkg.name!,
  hookHandlers: {
    config: import.meta.resolve('./hooks/config.js'),
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
