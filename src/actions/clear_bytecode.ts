import { clearBytecode } from '../lib/clear_bytecode.js';
import type { NewTaskActionFunction } from 'hardhat/types/tasks';

const action: NewTaskActionFunction = async (args, hre) => {
  await clearBytecode(hre, hre.config.bytecodeExporter);
};

export default action;
