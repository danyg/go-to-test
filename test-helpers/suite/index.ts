import { createMochaRunner } from './create-mocha-runner';
import { testPath } from 'test-helpers/test-paths';

export const run = createMochaRunner(testPath, '**/**.e2e.test.js');
