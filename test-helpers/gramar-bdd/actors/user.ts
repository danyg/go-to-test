import * as vscode from 'vscode';

export default class User {
  public static getInstance() {
    return new User();
  }

  private constructor() {}

  public async opensFile(filePath: string) {
    const basePath = vscode.workspace.workspaceFolders![0].uri;

    const file: vscode.Uri = vscode.Uri.joinPath(basePath, filePath);

    const doc: vscode.TextDocument = await vscode.workspace.openTextDocument(file);
    await vscode.window.showTextDocument(doc);
  }

  public async goesToTest() {
    return vscode.commands.executeCommand('danyg-go-to-test.goToTest');
  }
}
