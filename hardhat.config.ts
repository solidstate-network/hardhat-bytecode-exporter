import hardhatBytecodeExporter from './src/index.js';
import type { HardhatUserConfig } from 'hardhat/config';

const config: HardhatUserConfig = {
  plugins: [hardhatBytecodeExporter],
  solidity: {
    version: '0.8.30',
    npmFilesToBuild: ['@solidstate/contracts/access/ownable/Ownable.sol'],
  },
};

export default config;
