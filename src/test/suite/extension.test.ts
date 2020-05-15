import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

const assertMatch = (text: String, regexp: RegExp) => {
	if (text.match(regexp) === null) {

		throw new assert.AssertionError({
			message: `"${text}" does NOT match with "${regexp.toString()}"`
		});
	}
};

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Test Preconditions are met', () => {
		assert.notEqual(vscode.workspace.rootPath, undefined, "wsFolder should not be undefined");
		assertMatch(vscode.workspace.rootPath ?? "", /.*test-fixtures.*/);
	});
});
