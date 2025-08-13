import { TASK_BYTECODE_INSPECT } from '../task_names.js';
import { task } from 'hardhat/config';

export default task(TASK_BYTECODE_INSPECT)
  .addPositionalArgument({
    name: 'contractNameOrFullyQualifiedName',
    description: 'TODO',
  })
  .addFlag({
    name: 'noCompile',
    description: "Don't compile before running this task",
  })
  .setAction(() => import('../actions/bytecode_inspect.js'))
  .build();
