import System from 'interfaces/system';
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

  public async createFile(filePath: string) {
    const workspaceEdit = new this.vscode.WorkspaceEdit();
    const fileURI = this.vscode.Uri.file(filePath);
    workspaceEdit.createFile(fileURI);
    await this.vscode.workspace.applyEdit(workspaceEdit);
  }

  public async fileExists(filePath: string): Promise<boolean> {
    const fileURI = this.vscode.Uri.file(filePath);
    try {
      await this.vscode.workspace.fs.stat(fileURI);
      return true;
    } catch (e) {
      return false;
    }
  }
}
