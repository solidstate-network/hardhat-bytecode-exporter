import HardhatBytecodeExporter from './src/index.js';
import type { HardhatUserConfig } from 'hardhat/config';

const config: HardhatUserConfig = {
  plugins: [HardhatBytecodeExporter],
};

export default config;
