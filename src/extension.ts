import VsCodeSystem from './vscode-adapters/vscode-system';
import VSCodeUI from './vscode-adapters/vscode-ui';
import GoToTest from './core/go-to-test';
import VSCodeConfiguration from './vscode-adapters/vscode-configuration';
import * as vscode from 'vscode';

const goToTestExtension = new GoToTest(
  VsCodeSystem.getInstance(
    {
      get activeTextEditor() {
        return vscode.window.activeTextEditor;
      },
      openTextDocument: vscode.workspace.openTextDocument,
      showTextDocument: vscode.window.showTextDocument
    },
    {
      stringToURI: vscode.Uri.file,
      registerCommand: vscode.commands.registerCommand
    }
  ),
  VSCodeUI.getInstance(vscode.window),
  VSCodeConfiguration.getInstance()
);

export const activate = goToTestExtension.activate.bind(goToTestExtension);
// export function deactivate() {}
