import * as path from 'path';

import { runTests } from 'vscode-test';
import { testHelpersPath, projectPath } from './test-paths';

async function main() {
  try {
    const extensionDevelopmentPath = projectPath;
    const suiteExecutorPath = path.resolve(testHelpersPath, './suite/index');
    const testWorkspace = path.resolve(projectPath, './test-fixtures');

    console.log(
      '\u001b[1;36m',
      `extensionDevelopmentPath: ${extensionDevelopmentPath}`,
      '\u001b[0m'
    );
    console.log('\u001b[1;36m', `suiteExecutorPath:        ${suiteExecutorPath}`, '\u001b[0m');
    console.log('\u001b[1;36m', `testWorkspace:            ${testWorkspace}`, '\u001b[0m');

    // Download VS Code, unzip it and run the integration test
    await runTests({
      version: 'insiders',
      extensionDevelopmentPath,
      extensionTestsPath: suiteExecutorPath,
      launchArgs: [testWorkspace]
    });
  } catch (err) {
    console.error('Failed to run tests\n', err);
    process.exit(1);
  }
}

main();
