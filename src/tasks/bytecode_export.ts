import { TASK_BYTECODE_EXPORT } from '../task_names.js';
import { task } from 'hardhat/config';

export default task(TASK_BYTECODE_EXPORT)
  .setDescription(
    'Extract bytecode from compilation artifacts and write to a directory',
  )
  .addFlag({
    name: 'noCompile',
    description: "Don't compile before running this task",
  })
  .setAction(() => import('../actions/bytecode_export.js'))
  .build();
