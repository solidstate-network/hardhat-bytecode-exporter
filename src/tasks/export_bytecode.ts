import { name as pluginName } from '../../package.json';
import { BytecodeExporterConfigEntry } from '../index';
import fs from 'fs';
import { TASK_COMPILE } from 'hardhat/builtin-tasks/task-names';
import { task, subtask, types } from 'hardhat/config';
import { HardhatPluginError } from 'hardhat/plugins';
import path from 'path';

task('export-bytecode')
  .addFlag('noCompile', "Don't compile before running this task")
  .setAction(async (args, hre) => {
    if (!args.noCompile) {
      await hre.run(TASK_COMPILE, { noExportbytecode: true });
    }

    const configs = hre.config.bytecodeExporter;

    await Promise.all(
      configs.map((bytecodeGroupConfig) => {
        return hre.run('export-bytecode-group', { bytecodeGroupConfig });
      }),
    );
  });

subtask('export-bytecode-group')
  .addParam(
    'bytecodeGroupConfig',
    'a single bytecode-exporter config object',
    undefined,
    types.any,
  )
  .setAction(async (args, hre) => {
    const { bytecodeGroupConfig: config } = args as {
      bytecodeGroupConfig: BytecodeExporterConfigEntry;
    };

    const outputDirectory = path.resolve(hre.config.paths.root, config.path);

    if (outputDirectory === hre.config.paths.root) {
      throw new HardhatPluginError(
        pluginName,
        'resolved path must not be root directory',
      );
    }

    const outputData: { bytecode: string; destination: string }[] = [];

    const fullNames = await hre.artifacts.getAllFullyQualifiedNames();

    await Promise.all(
      fullNames.map(async (fullName) => {
        if (config.only.length && !config.only.some((m) => fullName.match(m)))
          return;
        if (
          config.except.length &&
          config.except.some((m) => fullName.match(m))
        )
          return;

        let { bytecode, sourceName, contractName } =
          await hre.artifacts.readArtifact(fullName);

        bytecode = bytecode.replace(/^0x/, '');

        if (!bytecode.length) return;

        const destination =
          path.resolve(
            outputDirectory,
            config.rename(sourceName, contractName),
          ) + '.bin';

        outputData.push({ bytecode, destination });
      }),
    );

    outputData.reduce((acc, { destination }) => {
      if (acc.has(destination)) {
        throw new HardhatPluginError(
          pluginName,
          `duplicate output destination: ${destination}`,
        );
      }

      acc.add(destination);
      return acc;
    }, new Set());

    if (config.clear) {
      await hre.run('clear-bytecode-group', { path: config.path });
    }

    await Promise.all(
      outputData.map(async ({ bytecode, destination }) => {
        await fs.promises.mkdir(path.dirname(destination), { recursive: true });
        await fs.promises.writeFile(destination, bytecode, { flag: 'w' });
      }),
    );
  });
