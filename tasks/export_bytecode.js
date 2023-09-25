const fs = require('fs');
const path = require('path');
const { HardhatPluginError } = require('hardhat/plugins');
const { types } = require('hardhat/config');
const {
  TASK_COMPILE,
} = require('hardhat/builtin-tasks/task-names');

const { name: PLUGIN_NAME } = require('../package.json');

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
    throw new HardhatPluginError(PLUGIN_NAME, 'resolved path must not be root directory');
  }

  const outputData = [];

  const fullNames = await hre.artifacts.getAllFullyQualifiedNames();

  await Promise.all(fullNames.map(async function (fullName) {
    if (config.only.length && !config.only.some(m => fullName.match(m))) return;
    if (config.except.length && config.except.some(m => fullName.match(m))) return;

    let { bytecode, deployedBytecode, sourceName, contractName } = await hre.artifacts.readArtifact(fullName);

    bytecode = bytecode.replace(/^0x/, '');
    deployedBytecode = deployedBytecode.replace(/^0x/, "");

    if (!bytecode.length) return;

    const destination = path.resolve(
      outputDirectory,
      config.rename(sourceName, contractName)
    ) + '.bin';

    const deployedDestination = path.resolve(
      outputDirectory,
      "deployed",
      config.rename(sourceName, contractName)
    ) + ".bin-runtime";

    outputData.push({ bytecode, destination, deployedBytecode, deployedDestination });
  }));

  outputData.reduce(function (acc, { destination }) {
    if (acc.has(destination)) {
      throw new HardhatPluginError(PLUGIN_NAME, `duplicate output destination: ${ destination }`);
    }

    acc.add(destination);
    return acc;
  }, new Set());

  if (config.clear) {
    await hre.run('clear-bytecode-group', { path: config.path });
  }

  await Promise.all(outputData.map(async function ({ bytecode, destination, deployedBytecode, deployedDestination }) {
    await fs.promises.mkdir(path.dirname(destination), { recursive: true });
    await fs.promises.writeFile(destination, bytecode, { flag: 'w' });

    if (config.includeDeployed) {
      await fs.promises.mkdir(path.dirname(deployedDestination), {recursive: true});
      await fs.promises.writeFile(deployedDestination, deployedBytecode, {flag: "w"});
    }
  }));
});
