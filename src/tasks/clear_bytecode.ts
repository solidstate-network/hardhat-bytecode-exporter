import { TASK_CLEAR_BYTECODE } from '../task_names.js';
import { task } from 'hardhat/config';

export default task(TASK_CLEAR_BYTECODE)
  .setDescription('Remove extracted bytecode files')
  .setAction(import.meta.resolve('../actions/clear_bytecode.js'))
  .build();
