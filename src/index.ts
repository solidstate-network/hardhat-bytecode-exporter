import pkg from '../package.json';
import './tasks/clear_bytecode';
import './tasks/compile';
import './tasks/export_bytecode';
import 'hardhat/types/config';
import type { HardhatPlugin } from 'hardhat/types/plugins';

const plugin: HardhatPlugin = {
  id: pkg.name!,
  npmPackage: pkg.name!,
  hookHandlers: {
    config: import.meta.resolve('./hooks/config.js'),
  },
};

export default plugin;
