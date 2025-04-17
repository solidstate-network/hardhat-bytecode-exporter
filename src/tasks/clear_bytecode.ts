import { TASK_CLEAR_BYTECODE } from '../task_names.js';
import deleteEmpty from 'delete-empty';
import fs from 'fs';
import { task, subtask, types } from 'hardhat/config';
import path from 'path';

const readdirRecursive = (dirPath: string, output: string[] = []) => {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    file = path.join(dirPath, file);

    if (fs.statSync(file).isDirectory()) {
      output = readdirRecursive(file, output);
    } else {
      output.push(file);
    }
  });

  return output;
};

task(TASK_CLEAR_BYTECODE, async (_, hre) => {
  const configs = hre.config.bytecodeExporter;

  await Promise.all(
    configs.map((bytecodeExporterConfig) => {
      return hre.run('clear-bytecode-group', {
        path: bytecodeExporterConfig.path,
      });
    }),
  );
});

subtask('clear-bytecode-group')
  .addParam(
    'path',
    'path to look for exported bytecode',
    undefined,
    types.string,
  )
  .setAction(async (args, hre) => {
    const outputDirectory = path.resolve(hre.config.paths.root, args.path);

    if (!fs.existsSync(outputDirectory)) {
      return;
    }

    const files = readdirRecursive(outputDirectory);

    await Promise.all(
      files.map(async (file) => {
        if (path.extname(file) !== '.bin') {
          // bytecode must be stored as bin
          return;
        }

        const contents = await fs.promises.readFile(file);

        const str = contents.toString();
        const re = /^[0-9A-F]/i;

        if (!contents.byteLength || !re.test(str)) {
          return;
        }

        await fs.promises.rm(file);
      }),
    );

    await deleteEmpty(outputDirectory);
  });
