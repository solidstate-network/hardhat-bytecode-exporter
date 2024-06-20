import { TASK_COMPILE } from 'hardhat/builtin-tasks/task-names';
import { task } from 'hardhat/config';

task(TASK_COMPILE)
  .addFlag(
    'noExportBytecode',
    "Don't export bytecode after running this task, even if runOnCompile option is enabled",
  )
  .setAction(async function (args, hre, runSuper) {
    await runSuper();

    if (!args.noExportBytecode && !(hre as any).__SOLIDITY_COVERAGE_RUNNING) {
      const configs = hre.config.bytecodeExporter;

      await Promise.all(
        configs.map((bytecodeGroupConfig) => {
          if (bytecodeGroupConfig.runOnCompile) {
            return hre.run('export-bytecode-group', { bytecodeGroupConfig });
          }
        }),
      );
    }
  });
