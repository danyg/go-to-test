import * as vscode from 'vscode';
import System from '../interfaces/system';

export default class VsCodeSystem implements System {
  public static getInstance() {
    return new VsCodeSystem();
  }

  public registerCommand = vscode.commands.registerCommand;

  public getActiveTextEditorFilePath(): string | null {
    if (!vscode.window.activeTextEditor) {
      return null;
    }

    return vscode.window.activeTextEditor.document.fileName;
  }

  public async openFileInEditor(filePath: string) {
    const uri = vscode.Uri.file(filePath);
    const doc: vscode.TextDocument = await vscode.workspace.openTextDocument(uri);
    await vscode.window.showTextDocument(doc);
  }
}
