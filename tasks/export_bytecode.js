const fs = require('fs');
const path = require('path');
const { HardhatPluginError } = require('hardhat/plugins');
const { types } = require('hardhat/config');
const {
  TASK_COMPILE,
} = require('hardhat/builtin-tasks/task-names');

task(
  'export-bytecode'
).addFlag(
  'noCompile', 'Don\'t compile before running this task'
).setAction(async function (args, hre) {
  if (!args.noCompile) {
    await hre.run(TASK_COMPILE, { noExportbytecode: true });
  }

  const configs = hre.config.bytecodeExporter;

  await Promise.all(configs.map(bytecodeGroupConfig => {
    return hre.run('export-bytecode-group', { bytecodeGroupConfig });
  }));
});

subtask(
  'export-bytecode-group'
).addParam(
  'bytecodeGroupConfig', 'a single bytecode-exporter config object', undefined, types.any
).setAction(async function (args, hre) {
  const { bytecodeGroupConfig: config } = args;

  const outputDirectory = path.resolve(hre.config.paths.root, config.path);

  if (outputDirectory === hre.config.paths.root) {
    throw new HardhatPluginError('resolved path must not be root directory');
  }

  const outputData = [];

  const fullNames = await hre.artifacts.getAllFullyQualifiedNames();

  await Promise.all(fullNames.map(async function (fullName) {
    if (config.only.length && !config.only.some(m => fullName.match(m))) return;
    if (config.except.length && config.except.some(m => fullName.match(m))) return;

    let { abi, sourceName, contractName } = await hre.artifacts.readArtifact(fullName);

    if (!abi.length) return;

    abi = abi.filter((element, index, array) => config.filter(element, index, array, fullName));

    if (config.format == 'minimal') {
      // abi = new Interface(abi).format(FormatTypes.minimal);
    } else if (config.format == 'fullName') {
      // abi = new Interface(abi).format(FormatTypes.fullName);
    } else if (config.format != 'json') {
      throw new HardhatPluginError(`Unknown format: ${config.format}`);
    }

    const destination = path.resolve(
      outputDirectory,
      config.rename(sourceName, contractName)
    ) + '.json';

    outputData.push({ abi, destination });
  }));

  outputData.reduce(function (acc, { destination }) {
    if (acc.has(destination)) {
      throw new HardhatPluginError(`duplicate output destination: ${ destination }`);
    }

    acc.add(destination);
    return acc;
  }, new Set());

  if (config.clear) {
    await hre.run('clear-bytecode-group', { path: config.path });
  }

  await Promise.all(outputData.map(async function ({ abi, destination }) {
    await fs.promises.mkdir(path.dirname(destination), { recursive: true });
    await fs.promises.writeFile(destination, `${JSON.stringify(abi, null, config.spacing)}\n`, { flag: 'w' });
  }));
});