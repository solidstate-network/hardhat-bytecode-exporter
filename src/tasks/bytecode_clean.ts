import { TASK_BYTECODE_CLEAN } from '../task_names.js';
import { task } from 'hardhat/config';

export default task(TASK_BYTECODE_CLEAN)
  .setDescription('Remove extracted bytecode files')
  .setAction(() => import('../actions/bytecode_clean.js'))
  .build();
