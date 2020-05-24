import { createMochaRunner } from './create-mocha-runner';
import { testPath } from '../test-paths';

export const run = createMochaRunner(testPath, '**/**.e2e-test.js');
