import { clearBytecode } from '../lib/clear_bytecode.js';
import type { CleanHooks } from 'hardhat/types/hooks';

export default async (): Promise<Partial<CleanHooks>> => ({
  onClean: async (context) => {
    await clearBytecode(context, context.config.bytecodeExporter);
  },
});
