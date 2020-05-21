import * as path from 'path';

import { runTests } from 'vscode-test';
import { srcPath, testHelpersPath, projectPath } from './test-paths';

async function main() {
	try {
		const extensionDevelopmentPath = projectPath;
		const suiteExecutorPath = path.resolve(testHelpersPath, './suite/index');
		const testWorkspace = path.resolve(projectPath, './test-fixtures');

		console.log(`TESTING INTO: ${testWorkspace}`);

		// Download VS Code, unzip it and run the integration test
		await runTests({
			// version: 'insiders',
			extensionDevelopmentPath,
			extensionTestsPath: suiteExecutorPath,
			launchArgs: [testWorkspace]
		});

	} catch (err) {
		console.error('Failed to run tests');
		process.exit(1);
	}
}

main();
