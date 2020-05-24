import { createMochaRunner } from './suite/create-mocha-runner';
import { testPath } from './test-paths';

const runTests = createMochaRunner(testPath, '**/*.u.test.js');

runTests().catch(() => {
  console.error('Failed to run tests');
  process.exit(1);
});
