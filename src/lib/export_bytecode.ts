import pkg from '../../package.json';
import type {
  BytecodeExporterConfig,
  BytecodeExporterConfigEntry,
} from '../types.js';
import { clearBytecode } from './clear_bytecode.js';
import { HardhatPluginError } from 'hardhat/plugins';
import type { HookContext } from 'hardhat/types/hooks';
import fs from 'node:fs';
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

  // get list of all contracts and filter according to configuraiton

  const fullNames = Array.from(
    await context.artifacts.getAllFullyQualifiedNames(),
  ).filter((fullName) => {
    if (config.only.length && !config.only.some((m) => fullName.match(m)))
      return false;
    if (config.except.length && config.except.some((m) => fullName.match(m)))
      return false;
    return true;
  });

  // get contract artifacts

  const artifacts = await Promise.all(
    fullNames.map((fullName) => context.artifacts.readArtifact(fullName)),
  );

  // filter out 0-size contracts and generate export file contents

  const outputData = artifacts
    .filter(({ bytecode }) => bytecode.length)
    .map((artifact) => {
      const { sourceName, contractName, bytecode, deployedBytecode } = artifact;

      const destination =
        path.resolve(outputDirectory, config.rename(sourceName, contractName)) +
        '.bin';

      const deployedDestination =
        path.resolve(outputDirectory, config.rename(sourceName, contractName)) +
        '.deployed.bin';

      // TODO: respond to config.includeDeployed

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
    outputData.map(async ({ destination, contents }) => {
      await fs.promises.mkdir(path.dirname(destination), { recursive: true });
      await fs.promises.writeFile(destination, contents);
    }),
  );
};
