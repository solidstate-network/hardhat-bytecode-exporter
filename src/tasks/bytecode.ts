import { TASK_BYTECODE } from '../task_names.js';
import { emptyTask } from 'hardhat/config';

export default emptyTask(
  TASK_BYTECODE,
  'Interact with contract bytecode',
).build();
