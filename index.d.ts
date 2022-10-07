import 'hardhat/types/config';

interface BytecodeExporterUserConfig {
  path?: string,
  runOnCompile?: boolean,
  clear?: boolean,
  flat?: boolean,
  only?: string[],
  except?: string[],
  spacing?: number,
  rename?: (sourceName: string, contractName: string) => string,
}

declare module 'hardhat/types/config' {
  interface HardhatUserConfig {
    bytecodeExporter?: BytecodeExporterUserConfig | BytecodeExporterUserConfig[]
  }

  interface HardhatConfig {
    bytecodeExporter: {
      path: string,
      runOnCompile: boolean,
      clear: boolean,
      flat: boolean,
      only: string[],
      except: string[],
      spacing: number,
      rename: (sourceName: string, contractName: string) => string,
    }[]
  }
}
