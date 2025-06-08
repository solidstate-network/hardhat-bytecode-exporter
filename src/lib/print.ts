import { createTable } from '@solidstate/hardhat-solidstate-utils/table';
import chalk from 'chalk';

const formatBytecode = (bytecode: string) => {
  return bytecode
    .replace('0x', chalk.gray('0x'))
    .replaceAll(/(__\$\w*\$__)/g, chalk.yellow('$1'));
};

export const printBytecode = (
  contractNameOrFullyQualifiedName: string,
  bytecode: string,
  deployedBytecode: string,
) => {
  const table = createTable({
    colWidths: [38, 38],
  });

  // TODO: format fully qualified name

  const bytecodeSize = Buffer.from(
    bytecode.replace(/__\$\w*\$__/g, '0'.repeat(40)).slice(2),
    'hex',
  ).length;
  const deployedBytecodeSize = Buffer.from(
    deployedBytecode.replace(/__\$\w*\$__/g, '0'.repeat(40)).slice(2),
    'hex',
  ).length;

  table.push([{ content: contractNameOrFullyQualifiedName, colSpan: 2 }]);
  table.push([
    {
      content: 'Initialization Bytecode',
    },
    { content: chalk.gray(`${bytecodeSize} bytes`) },
  ]);
  table.push([
    {
      content: formatBytecode(bytecode),
      colSpan: 2,
      wordWrap: true,
      wrapOnWordBoundary: false,
    },
  ]);
  table.push([
    {
      content: 'Deployed Bytecode',
    },
    {
      content: chalk.gray(`${deployedBytecodeSize} bytes`),
    },
  ]);
  table.push([
    {
      content: formatBytecode(deployedBytecode),
      colSpan: 2,
      wordWrap: true,
      wrapOnWordBoundary: false,
    },
  ]);

  console.log(table.toString());
};
