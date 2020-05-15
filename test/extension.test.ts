import * as expect from 'expect';
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

describe('Extension Test Suite', () => {
	before(() => vscode.window.showInformationMessage('Start all tests.'));
	after(() => vscode.window.showInformationMessage('All tests run.'));

	it('Test Preconditions are met', () => {
		expect(vscode.workspace.rootPath).not.toBeUndefined();
		expect(vscode.workspace.rootPath).toMatch(/.*test-fixtures.*/);
	});
});
