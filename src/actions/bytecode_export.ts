import { exportBytecode } from '../lib/export_bytecode.js';
import { TASK_COMPILE } from '../task_names.js';
import type { NewTaskActionFunction } from 'hardhat/types/tasks';

interface TaskActionArguments {
  noCompile: boolean;
}

const action: NewTaskActionFunction<TaskActionArguments> = async (
  args,
  hre,
) => {
  if (hre.globalOptions.noExportBytecode) return;

  if (!args.noCompile) {
    hre.globalOptions.noExportBytecode = true;
    await hre.tasks.getTask(TASK_COMPILE).run();
  }

  await exportBytecode(hre, hre.config.bytecodeExporter);
};

export default action;
