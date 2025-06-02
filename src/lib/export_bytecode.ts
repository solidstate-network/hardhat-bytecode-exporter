import pkg from '../../package.json' with { type: 'json' };
import type {
  BytecodeExporterConfig,
  BytecodeExporterConfigEntry,
} from '../types.js';
import { clearBytecode } from './clear_bytecode.js';
import { writeUtf8File } from '@nomicfoundation/hardhat-utils/fs';
import { readArtifacts } from '@solidstate/hardhat-solidstate-utils/filter';
import { HardhatPluginError } from 'hardhat/plugins';
import type { HookContext } from 'hardhat/types/hooks';
import path from 'node:path';

export const exportBytecode = async (
  context: HookContext,
  configEntries: BytecodeExporterConfig,
) => {
  await clearBytecode(context, configEntries);

  await Promise.all(
    configEntries.map((entry) => exportBytecodeGroup(context, entry)),
  );
};

const exportBytecodeGroup = async (
  context: HookContext,
  config: BytecodeExporterConfigEntry,
) => {
  const outputDirectory = path.resolve(context.config.paths.root, config.path);

  // validate that the output directory is not the Hardhat root directory to prevent accidental file deletion

  if (outputDirectory === context.config.paths.root) {
    throw new HardhatPluginError(
      pkg.name,
      'resolved path must not be root directory',
    );
  }

  // get contract artifacts, filtered according to configuration

  const artifacts = await readArtifacts(context, config);

  // filter out 0-size contracts and generate export file contents

  const outputData = artifacts
    .filter(({ bytecode }) => bytecode.length > 2)
    .map((artifact) => {
      const { sourceName, contractName, bytecode, deployedBytecode } = artifact;

      const destination =
        path.resolve(outputDirectory, config.rename(sourceName, contractName)) +
        '.init.bin';

      const deployedDestination =
        path.resolve(outputDirectory, config.rename(sourceName, contractName)) +
        '.deployed.bin';

      return [
        {
          contents: bytecode.replace(/^0x/, ''),
          destination,
        },
        {
          contents: deployedBytecode.replace(/^0x/, ''),
          destination: deployedDestination,
        },
      ];
    })
    .flat();

  // check for filename clashes among exported files

  outputData.reduce(
    (acc: { [destination: string]: string }, { destination, contents }) => {
      const previousContents = acc[destination];

      if (previousContents && previousContents !== contents) {
        throw new HardhatPluginError(
          pkg.name,
          `multiple distinct contracts share same output destination: ${destination}`,
        );
      }

      acc[destination] = contents;
      return acc;
    },
    {},
  );

  // write export files to disk

  await Promise.all(
    outputData.map(({ destination, contents }) =>
      writeUtf8File(destination, contents),
    ),
  );
};
