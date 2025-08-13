import type { FilterOptions } from '@solidstate/hardhat-solidstate-utils/types';

export type BytecodeExporterConfigEntry = {
  path: string;
  runOnCompile: boolean;
  clear: boolean;
  flat: boolean;
  rename: (sourceName: string, contractName: string) => string;
} & FilterOptions;

export type BytecodeExporterUserConfigEntry =
  Partial<BytecodeExporterConfigEntry>;

export type BytecodeExporterConfig = BytecodeExporterConfigEntry[];

export type BytecodeExporterUserConfig =
  | BytecodeExporterUserConfigEntry
  | BytecodeExporterUserConfigEntry[];
