import { resolve } from 'path';

export const projectPath = resolve(__dirname, '../../');
export const outPath = resolve(__dirname, '../');
export const testPath = resolve(outPath, 'test');
export const srcPath = resolve(outPath, 'src');
export const testHelpersPath = resolve(__dirname);
export const testWorkspace = resolve(projectPath, './test-fixtures');
