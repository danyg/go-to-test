import * as expect from 'expect';
import * as vscode from 'vscode';
import { Matchers } from 'expect/build/types';
import FileSystemForTests from './actors/file-system-for-tests';

class Then {
  private expectAccessor = { expect };

  I() {
    return this.expectAccessor;
  }

  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  isExpected = grammarExpect;

  theActiveTextEditorFileName = (): expect.Matchers<string> => {
    expect(vscode.window.activeTextEditor).not.toBeNull();

    if (undefined !== vscode.window.activeTextEditor) {
      return expect(vscode.window.activeTextEditor.document.fileName);
    }
    throw new Error('no activeTextEditor');
  };

  async theFileSystem() {
    const listOfFiles: string[] = await FileSystemForTests.getInstance().getListOfFS();
    return expect(listOfFiles);
  }
}

export const then = () => new Then();

function grammarExpect(): Then;
function grammarExpect<T>(arg: T): Matchers<T>;
function grammarExpect<T>(...args: T[] | never) {
  if (args.length === 0) {
    return then();
  } else {
    return expect<T>(args[0]);
  }
}
