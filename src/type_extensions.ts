import { BytecodeExporterConfig, BytecodeExporterUserConfig } from './types.js';

declare module 'hardhat/types/config' {
  interface HardhatConfig {
    bytecodeExporter: BytecodeExporterConfig;
  }

  interface HardhatUserConfig {
    bytecodeExporter?: BytecodeExporterUserConfig;
  }
}

declare module 'hardhat/types/global-options' {
  interface GlobalOptions {
    noExportBytecode: boolean;
  }
}
