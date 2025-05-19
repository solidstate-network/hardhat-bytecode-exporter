export interface BytecodeExporterConfigEntry {
  path: string;
  runOnCompile: boolean;
  includeDeployed: boolean;
  clear: boolean;
  flat: boolean;
  only: string[];
  except: string[];
  rename: (sourceName: string, contractName: string) => string;
}

export type BytecodeExporterUserConfigEntry =
  Partial<BytecodeExporterConfigEntry>;

export type BytecodeExporterConfig = BytecodeExporterConfigEntry[];

export type BytecodeExporterUserConfig =
  | BytecodeExporterUserConfigEntry
  | BytecodeExporterUserConfigEntry[];
