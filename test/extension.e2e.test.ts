import * as expect from 'expect';
import * as vscode from 'vscode';
import { given, when, then } from '../test-helpers/gramar-bdd';
import { endWith, pathOsAgnostic } from '../test-helpers/path-helpers';

describe('Extension Test Suite', () => {
  it('Test Preconditions are met', () => {
    const rootPath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
    expect(rootPath).not.toBeUndefined();
    expect(rootPath).toMatch(/.*test-fixtures.*/);
  });

  it('should go to a test file using maven like strategy', async () => {
    const srcFile = '/maven-like-strategy/src/package1/source.code.js';
    const tstFile = 'maven-like-strategy/test/package1/source.code.test.js';
    await given().vscode().isConfigured().withMavenLikeStrategy();
    await given().user().had().openAFile(srcFile);

    await when().user().goesToTest();

    then()
      .isExpected()
      .theActiveTextEditorFileName()
      .toMatch(endWith(pathOsAgnostic(tstFile)));
  });

  it('should go to a test file using maven strategy', async () => {
    const srcFile = '/maven-strategy/src/main/java/com/company/package/MyClass.java';
    const tstFile = '/maven-strategy/src/test/java/com/company/package/MyClassTest.java';
    await given().vscode().isConfigured().withMavenStrategy();
    await given().user().had().openAFile(srcFile);

    await when().user().goesToTest();

    then()
      .isExpected()
      .theActiveTextEditorFileName()
      .toMatch(endWith(pathOsAgnostic(tstFile)));
  }).timeout(9999999999);
});
