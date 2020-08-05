import { mock, instance, verify, when, anything } from 'ts-mockito';
import VsCodeSystem from '../../src/vscode-adapters/vscode-system';
import {
  VSCodeEditor,
  VSCodeSystemIO,
  VSCodeTextDocument,
  VSCodeTextEditor,
  RegisterCommandFn,
  VSCodeURI
} from '../../src/vscode-adapters/types';
import * as expect from 'expect';

/**
 * **NOTE**
 * Take in account that these tests are IMPLEMENTATION / CONTRACT tests are
 * they are coupled to vscode current api and it's testing some logic but
 * mainly that are properly coupled to current (July 2020) VSCODE API
 * design
 **/

describe('VSCodeSystem', () => {
  let vscodeEditorMock: VSCodeEditor;
  let vscodeSystemIOMock: VSCodeSystemIO;

  let textDocumentMock: VSCodeTextDocument;
  let textEditorMock: VSCodeTextEditor;
  let vscodeURIMock: VSCodeURI;

  beforeEach(() => {
    vscodeEditorMock = mock<VSCodeEditor>();
    vscodeSystemIOMock = mock<VSCodeSystemIO>();
    textDocumentMock = mock<VSCodeTextDocument>();
    textEditorMock = mock<VSCodeTextEditor>();
    vscodeURIMock = mock<VSCodeURI>();
  });

  it('registerCommand: should be vscode.commands.registerCommand', () => {
    const mockRegisterCommandFn: RegisterCommandFn = instance(mock<RegisterCommandFn>());
    when(vscodeSystemIOMock.registerCommand).thenReturn(mockRegisterCommandFn);
    const testSubject = VsCodeSystem.getInstance(
      instance(vscodeEditorMock),
      instance(vscodeSystemIOMock)
    );

    expect(testSubject.registerCommand).toBe(mockRegisterCommandFn);
  });

  it('getActiveTextEditorFilePath: should return a string with the fileName of current active text editor', () => {
    const expectedResult = 'somePathToCurrentFile.js';
    when(vscodeEditorMock.activeTextEditor).thenReturn(instance(textEditorMock));
    when(textEditorMock.document).thenReturn(instance(textDocumentMock));
    when(textDocumentMock.fileName).thenReturn(expectedResult);
    const testSubject = VsCodeSystem.getInstance(
      instance(vscodeEditorMock),
      instance(vscodeSystemIOMock)
    );

    const result = testSubject.getActiveTextEditorFilePath();

    expect(result).toEqual(expectedResult);
  });

  it('getActiveTextEditorFilePath: should return null when there is NO active text editor', () => {
    when(vscodeEditorMock.activeTextEditor).thenReturn(undefined);
    const testSubject = VsCodeSystem.getInstance(
      instance(vscodeEditorMock),
      instance(vscodeSystemIOMock)
    );

    const result = testSubject.getActiveTextEditorFilePath();

    expect(result).toBeNull();
  });

  it('openFileInEditor: ensure to open editor according to current vscode API Design', async () => {
    // *NOTE* This test is bad, even if reading it make sense, mock of interfaces
    // with ts-mockito are not real, IT mocks any given call or access to property,
    // but it doesn't properly comply with API... Is Kinda Luck that this test sort
    // of works

    // GIVEN
    const givenPath = '/workspaces/project/someFilePath.js';
    const uriInstanceMock = instance(vscodeURIMock);

    when(vscodeSystemIOMock.stringToURI(givenPath)).thenReturn(uriInstanceMock);
    const textDocumentInstanceMock: VSCodeTextDocument = instance(textDocumentMock);
    const textEditorMockInstance = instance(textEditorMock);
    makeMockSafeForPromisePipping((textDocumentInstanceMock as unknown) as MockWithThen);
    makeMockSafeForPromisePipping((textEditorMockInstance as unknown) as MockWithThen);

    const p: Promise<VSCodeTextDocument> = Promise.resolve(textDocumentInstanceMock);
    console.log('stubbedP', p);
    when(vscodeEditorMock.openTextDocument(anything())).thenReturn(p);
    when(vscodeEditorMock.showTextDocument(textDocumentInstanceMock)).thenReturn(
      Promise.resolve(textEditorMockInstance)
    );
    const testSubject = VsCodeSystem.getInstance(
      instance(vscodeEditorMock),
      instance(vscodeSystemIOMock)
    );

    // WHEN
    await testSubject.openFileInEditor(givenPath);
    restoreMock((textDocumentInstanceMock as unknown) as MockWithThen);
    restoreMock((textEditorMockInstance as unknown) as MockWithThen);

    // THEN
    verify(vscodeEditorMock.openTextDocument(anything())).called();
    verify(vscodeEditorMock.showTextDocument(textDocumentInstanceMock)).called();
  });
});

interface MockWithThen {
  then: (() => {}) | undefined;
  _then: (() => {}) | undefined;
}

/** As ts-mockito mocks of interface is so weird, then is present even if
 * the interface doesn't say so. So if the mock need to be the answer of
 * a promise, then must be removed as if not, it will pipe the promise
 * and it won't be ever resolved
 * @example
 *   const mockStuff = mock<IStuff>();
 *   const mockAnswer = Promise.resolve(instance(mockStuff));
 *   await mockAnswer;
 *   expect(true).toBe(true);
 * // that expect is never reached
 */
const makeMockSafeForPromisePipping = (mock: MockWithThen) => {
  mock._then = mock.then;
  mock.then = undefined;
};
const restoreMock = (mock: MockWithThen) => {
  mock.then = mock._then;
  mock._then = undefined;
  delete mock._then;
};
