const fs = require('fs');
const path = require('path');
const deleteEmpty = require('delete-empty');
const { types } = require('hardhat/config');

const readdirRecursive = function(dirPath, output = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(function(file) {
    file = path.join(dirPath, file);

    if (fs.statSync(file).isDirectory()) {
      output = readdirRecursive(file, output);
    } else {
      output.push(file);
    }
  });

  return output;
};

task('clear-bytecode', async function (_, hre) {
  const configs = hre.config.bytecodeExporter;

  await Promise.all(configs.map((bytecodeExporterConfig) => {
    return hre.run('clear-bytecode-group', { path: bytecodeExporterConfig.path });
  }));
});

subtask(
  'clear-bytecode-group'
).addParam(
  'path', 'path to look for exported bytecode', undefined, types.string
).setAction(async function (args, hre) {
  const outputDirectory = path.resolve(hre.config.paths.root, args.path);

  if (!fs.existsSync(outputDirectory)) {
    return;
  }

  const files = readdirRecursive(outputDirectory);

  await Promise.all(files.map(async function (file) {
    if (path.extname(file) !== '.bin') {
      // bytecode must be stored as bin
      return;
    }

    const contents = await fs.promises.readFile(file);

    // TODO: validate that bytecode is only data contained in file
    // TODO: validate that bytecode is valid hex

    if (!contents.byteLength) {
      return;
    }

    await fs.promises.rm(file);
  }));

  await deleteEmpty(outputDirectory);
});
