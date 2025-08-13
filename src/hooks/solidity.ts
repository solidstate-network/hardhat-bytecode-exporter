import { exportBytecode } from '../lib/export_bytecode.js';
import type { SolidityHooks } from 'hardhat/types/hooks';

export default async (): Promise<Partial<SolidityHooks>> => ({
  onCleanUpArtifacts: async (context, artifactPaths, next) => {
    if (
      !context.globalOptions.noExportBytecode &&
      !context.globalOptions.coverage
    ) {
      const entries = context.config.bytecodeExporter.filter(
        (entry) => entry.runOnCompile,
      );

      await exportBytecode(context, entries);
    }

    return next(context, artifactPaths);
  },
});
