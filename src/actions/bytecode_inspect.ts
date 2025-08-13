import { printBytecode } from '../lib/print.js';
import { TASK_COMPILE } from '../task_names.js';
import type { NewTaskActionFunction } from 'hardhat/types/tasks';

interface TaskActionArguments {
  contractNameOrFullyQualifiedName: string;
  noCompile: boolean;
}

const action: NewTaskActionFunction<TaskActionArguments> = async (
  args,
  hre,
) => {
  if (!args.noCompile) {
    hre.globalOptions.noExportBytecode = true;
    await hre.tasks.getTask(TASK_COMPILE).run();
  }

  const { contractNameOrFullyQualifiedName } = args;

  const { bytecode, deployedBytecode } = await hre.artifacts.readArtifact(
    contractNameOrFullyQualifiedName,
  );

  printBytecode(contractNameOrFullyQualifiedName, bytecode, deployedBytecode);
};

export default action;
