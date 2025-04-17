import { TASK_EXPORT_BYTECODE } from '../task_names.js';
import { task } from 'hardhat/config';

export default task(TASK_EXPORT_BYTECODE)
  .setDescription(
    'Extract bytecode from compilation artifacts and write to a directory',
  )
  .addFlag({
    name: 'noCompile',
    description: "Don't compile before running this task",
  })
  .setAction(import.meta.resolve('../actions/export_bytecode.js'))
  .build();
