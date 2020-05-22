import { createMochaRunner } from './e2e.mocha';
import { testPath } from '../test-paths';

export const run = createMochaRunner(testPath);
