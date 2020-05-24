import * as expect from 'expect';
import * as vscode from 'vscode';

class Then {
  private expectAccessor = { expect };

  I() {
    return this.expectAccessor;
  }

  isExpected = expect;

  theActiveTextEditorFileName(): expect.Matchers<string> {
    expect(vscode.window.activeTextEditor).not.toBeNull();

    if (undefined !== vscode.window.activeTextEditor) {
      return expect(vscode.window.activeTextEditor.document.fileName);
    }
    throw new Error('no activeTextEditor');
  }
}

export const then = () => new Then();
