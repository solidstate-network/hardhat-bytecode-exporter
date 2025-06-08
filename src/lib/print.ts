import { createTable } from '@solidstate/hardhat-solidstate-utils/table';

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
    { content: `Initialization Bytecode (${bytecodeSize} bytes)`, colSpan: 2 },
  ]);
  table.push([
    {
      content: bytecode,
      colSpan: 2,
      wordWrap: true,
      wrapOnWordBoundary: false,
    },
  ]);
  table.push([
    {
      content: `Deployed Bytecode (${deployedBytecodeSize} bytes)`,
      colSpan: 2,
    },
  ]);
  table.push([
    {
      content: deployedBytecode,
      colSpan: 2,
      wordWrap: true,
      wrapOnWordBoundary: false,
    },
  ]);

  console.log(table.toString());
};
