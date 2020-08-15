import System from '../interfaces/system';
import { RegisterCommandFn, VSCodeTextDocument, GoToTestVsCodeNS } from './types';
import { URI } from 'vscode-uri';

export default class VsCodeSystem implements System {
  public static getInstance(vscode: GoToTestVsCodeNS) {
    return new VsCodeSystem(vscode);
  }

  private constructor(private vscode: GoToTestVsCodeNS) {
    this.registerCommand = this.vscode.commands.registerCommand;
  }

  public registerCommand: RegisterCommandFn;

  public getActiveTextEditorFilePath(): string | null {
    if (!this.vscode.window.activeTextEditor) {
      return null;
    }

    return this.vscode.window.activeTextEditor.document.fileName;
  }

  public async openFileInEditor(filePath: string) {
    const uri: URI = this.vscode.Uri.file(filePath);
    const doc: VSCodeTextDocument = await this.vscode.workspace.openTextDocument(uri);
    await this.vscode.window.showTextDocument(doc);
  }
}
