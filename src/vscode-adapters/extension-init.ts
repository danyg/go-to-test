import { ExtensionContext } from '../interfaces/disposable';
import GoToTest from '../core/go-to-test';
import VsCodeSystem from './vscode-system';
import VSCodeUI from './vscode-ui';
import VSCodeConfiguration from './vscode-configuration';
import { GoToTestVsCodeNS } from './types';

export function extensionInit(vscode: GoToTestVsCodeNS): (context: ExtensionContext) => void {
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

  return goToTestExtension.activate.bind(goToTestExtension);
}
