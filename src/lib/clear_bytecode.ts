import type {
  BytecodeExporterConfig,
  BytecodeExporterConfigEntry,
} from '../types.js';
import deleteEmpty from 'delete-empty';
import type { HookContext } from 'hardhat/types/hooks';
import fs from 'node:fs';
import path from 'node:path';

export const clearBytecode = async (
  context: HookContext,
  configEntries: BytecodeExporterConfig,
) => {
  const entries = configEntries.filter((entry) => entry.clear);

  await Promise.all(entries.map((entry) => clearBytecodeGroup(context, entry)));
};

const clearBytecodeGroup = async (
  context: HookContext,
  config: BytecodeExporterConfigEntry,
) => {
  const outputDirectory = path.resolve(context.config.paths.root, config.path);

  if (!fs.existsSync(outputDirectory)) {
    return;
  }

  // recursively get all files from directory

  const files = (
    await fs.promises.readdir(outputDirectory, {
      recursive: true,
      withFileTypes: true,
    })
  )
    .filter((dirent) => dirent.isFile())
    .map((dirent) => path.resolve(dirent.parentPath, dirent.name));

  // validate file contents and delete

  await Promise.all(
    files.map(async (file) => {
      if (path.extname(file) !== '.bin') {
        // bytecode must be stored as bin
        return;
      }

      const contents = await fs.promises.readFile(file, 'utf-8');

      const str = contents;
      const re = /^[0-9A-F]/i;

      if (!contents.length || !re.test(str)) {
        return;
      }

      await fs.promises.rm(file);
    }),
  );

  // delete the directory if it's empty

  await deleteEmpty(outputDirectory);
};
