import * as expect from 'expect';
import * as vscode from 'vscode';
import { Matchers } from 'expect/build/types';

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
}

export const then = () => new Then();

function grammarExpect(): Then;
function grammarExpect<T>(arg: T): Matchers<T>;
function grammarExpect(...args: any | never) {
  if (args.length === 0) {
    return then();
  } else {
    return expect(args[0]);
  }
}
