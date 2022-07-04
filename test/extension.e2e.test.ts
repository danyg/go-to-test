import * as expect from 'expect';
import * as vscode from 'vscode';
import { given, when, then } from 'test-helpers/gramar-bdd';
import { endWith, pathOsAgnostic } from 'test-helpers/path-helpers';

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
    await given().user().has().openAFile(srcFile);

    await when().user().goesToTest();

    then()
      .isExpected()
      .theActiveTextEditorFileName()
      .toMatch(endWith(pathOsAgnostic(tstFile)));
  });

  it('should go to a test file using maven strategy', async () => {
    const srcFile = '/maven-strategy/src/main/java/com/company/package1/MyClass.java';
    const tstFile = '/maven-strategy/src/test/java/com/company/package1/MyClassTest.java';
    await given().vscode().isConfigured().withMavenStrategy();
    await given().user().has().openAFile(srcFile);

    await when().user().goesToTest();

    then()
      .isExpected()
      .theActiveTextEditorFileName()
      .toMatch(endWith(pathOsAgnostic(tstFile)));
  });

  it('should create the test file when it does not exists', async () => {
    const srcFile = 'maven-strategy/src/main/java/com/company/package1/MyUntestedClass.java';
    const expectedCreatedFile =
      'maven-strategy/src/test/java/com/company/package1/MyUntestedClassTest.java';
    await given().fileSystem().doesNotHave(expectedCreatedFile);
    await given().vscode().isConfigured().withMavenStrategy();
    await given().user().has().openAFile(srcFile);

    await when().user().goesToTest();

    const theFS = await then().isExpected().theFileSystem();
    theFS.toContain(expectedCreatedFile);
  });
});
