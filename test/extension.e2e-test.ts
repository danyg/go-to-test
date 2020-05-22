import * as expect from 'expect';
import * as vscode from 'vscode';
import { given, when, then } from '../test-helpers/gramar-bdd';
import { endWith, pathOsAgnostic } from '../test-helpers/path-helpers';

describe('Extension Test Suite', () => {
  // before(async () => vscode.window.showInformationMessage('Start all tests.'));
  // after(async () => vscode.window.showInformationMessage('All tests run.'));

  it('Test Preconditions are met', () => {
    const rootPath = vscode.workspace.workspaceFolders![0].uri.fsPath;
    expect(rootPath).not.toBeUndefined();
    expect(rootPath).toMatch(/.*test-fixtures.*/);
  });

  it('should go to a test using maven strategy', async () => {
    await given().user().opensFile('/maven-strategy/src/package1/source.code.js');

    await when().user().goesToTest();

    then()
      .isExpected(vscode.window.activeTextEditor!.document.fileName)
      .toMatch(endWith(pathOsAgnostic('maven-strategy/test/package1/source.code.test.js')));
  });
});
