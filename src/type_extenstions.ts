import { BytecodeExporterConfig, BytecodeExporterUserConfig } from './types.js';

declare module 'hardhat/types/config' {
  interface HardhatConfig {
    bytecodeExporter: BytecodeExporterConfig;
  }

  interface HardhatUserConfig {
    bytecodeExporter?: BytecodeExporterUserConfig;
  }
}
