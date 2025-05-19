import { clearBytecode } from '../lib/clear_bytecode.js';
import type { TaskOverrideActionFunction } from 'hardhat/types/tasks';

const action: TaskOverrideActionFunction = async (args, hre, runSuper) => {
  await runSuper(args);

  await clearBytecode(hre, hre.config.bytecodeExporter);
};

export default action;
