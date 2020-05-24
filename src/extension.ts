import * as vscode from 'vscode';

export interface UI {
  info(message: string): void;
}

class VSCodeUI implements UI {
  info(message: string): void {
    console.log(`[INFO]: ${message}`);
    vscode.window.showInformationMessage(message);
  }
}

export class GoToTest {
  public constructor(private ui: UI) {
    console.log('Go To Test Loaded!');
  }

  public activate(context: vscode.ExtensionContext) {
    this.ui.info('Go To Test ACTIVATED!');

    const disposable = this.registerTheCommand();

    context.subscriptions.push(disposable);
  }

  private registerTheCommand() {
    return vscode.commands.registerCommand(
      'danyg-go-to-test.goToTest',
      this.executeCommand.bind(this)
    );
  }

  public async executeCommand() {
    console.log('Go To Test executed!');
    const currentFile = this.getActiveTextEditorFilePath();
    const testFile = this.getTestFile(currentFile);

    await this.openFileInEditor(testFile);
  }

  private getActiveTextEditorFilePath() {
    return vscode.window.activeTextEditor!.document.fileName;
  }

  private async openFileInEditor(testFile: vscode.Uri) {
    this.ui.info(`Opening: ${testFile.fsPath}`);
    const doc: vscode.TextDocument = await vscode.workspace.openTextDocument(testFile);
    await vscode.window.showTextDocument(doc);
    this.ui.info(`${testFile.fsPath} Opened`);
  }

  private getTestFile(srcFilePath: string) {
    return vscode.Uri.file(this.getTestFilePath(srcFilePath));
  }

  private getTestFilePath(srcFilePath: string): string {
    return srcFilePath.replace(
      /^(?<projectPath>.*)src(?<moduleInternalPath>.*)\.(?<ext>[tj]sx?)$/,
      '$<projectPath>test$<moduleInternalPath>.test.$<ext>'
    );
  }

  private info(message: string) {
    console.log(`[INFO]: ${message}`);
    vscode.window.showInformationMessage(message);
  }
}

const goToTestExtension = new GoToTest(new VSCodeUI());

export const activate = goToTestExtension.activate.bind(goToTestExtension);
// export function deactivate() {}
