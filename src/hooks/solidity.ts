import type { SolidityHooks } from 'hardhat/types/hooks';

export default async (): Promise<Partial<SolidityHooks>> => ({
  onCleanUpArtifacts: async (context, artifactPaths, next) => {
    // TODO: skip if solidity coverage running
    if (!context.globalOptions.noExportBytecode) {
      const entries = context.config.bytecodeExporter.filter(
        (entry) => entry.runOnCompile,
      );

      // TODO: add lib function
      //   await exportBytecode(context, entries);
    }

    return next(context, artifactPaths);
  },
});
