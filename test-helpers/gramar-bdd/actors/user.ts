import * as vscode from 'vscode';

export default class User {
  public static getInstance() {
    return new User();
  }

  private constructor() {}

  public async opensFile(filePath: string) {
    const basePath = this.getFirstWorkspaceFolder().uri;

    const file: vscode.Uri = vscode.Uri.joinPath(basePath, filePath);

    const doc: vscode.TextDocument = await vscode.workspace.openTextDocument(file);
    await vscode.window.showTextDocument(doc);
  }

  public async goesToTest() {
    return vscode.commands.executeCommand('danyg-go-to-test.goToTest');
  }

  public had(): User {
    return this;
  }

  public openAFile = this.opensFile;
  public wentToTest = this.goesToTest;

  private getFirstWorkspaceFolder(): vscode.WorkspaceFolder {
    const wsf = vscode.workspace.workspaceFolders;
    this.assertInWorkspace(wsf);
    return wsf[0];
  }

  private assertInWorkspace(
    condition: readonly vscode.WorkspaceFolder[] | undefined
  ): asserts condition {
    if (!condition) {
      throw new Error('Not in a workspace, no folder opened in vscode!');
    }
  }
}
