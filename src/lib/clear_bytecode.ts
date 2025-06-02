import type {
  BytecodeExporterConfig,
  BytecodeExporterConfigEntry,
} from '../types.js';
import {
  exists,
  getAllFilesMatching,
  readUtf8File,
  remove,
} from '@nomicfoundation/hardhat-utils/fs';
import type { HookContext } from 'hardhat/types/hooks';
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

  if (!(await exists(outputDirectory))) {
    return;
  }

  // recursively get all relevant files from directory

  const binFiles = await getAllFilesMatching(
    outputDirectory,
    (absolutePathToFile) => path.extname(absolutePathToFile) === '.bin',
  );

  // validate file contents and delete

  await Promise.all(
    binFiles.map(async (file) => {
      const contents = await readUtf8File(file);

      if (!/^[0-9A-F]/i.test(contents)) {
        // file contains non-hex characters - do not delete
        return;
      }

      await remove(file);
    }),
  );

  // delete the directory if it's empty

  const remainingFiles = await getAllFilesMatching(outputDirectory);

  if (remainingFiles.length === 0) {
    await remove(outputDirectory);
  }
};
