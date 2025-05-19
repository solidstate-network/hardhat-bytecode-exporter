import { exportBytecode } from '../lib/export_bytecode.js';
import type { NewTaskActionFunction } from 'hardhat/types/tasks';

interface ExportBytecodeActionArguments {
  noCompile: boolean;
}

const action: NewTaskActionFunction<ExportBytecodeActionArguments> = async (
  args,
  hre,
) => {
  if (hre.globalOptions.noExportBytecode) return;

  if (!args.noCompile) {
    hre.globalOptions.noExportBytecode = true;
    // TODO: import task name constant
    await hre.tasks.getTask('compile').run();
  }

  await exportBytecode(hre, hre.config.bytecodeExporter);
};

export default action;
