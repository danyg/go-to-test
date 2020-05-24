/* eslint-disable @typescript-eslint/no-explicit-any */
import * as vscode from 'vscode';

export interface UserInterface {
  info(message: string): void;
}

export interface Disposable {
  dispose(): void;
}

interface ExtensionContext {
  subscriptions: Disposable[];
}

type Command = (...args: any[]) => any;

export interface System {
  registerCommand(command: string, callback: Command, thisArg?: any): Disposable;
  getActiveTextEditorFilePath(): string;
}

export class VsCodeSystem implements System {
  public registerCommand = vscode.commands.registerCommand;
  public getActiveTextEditorFilePath() {
    return vscode.window.activeTextEditor!.document.fileName;
  }
}

class VSCodeUI implements UserInterface {
  info(message: string): void {
    console.log(`[INFO]: ${message}`);
    vscode.window.showInformationMessage(message);
  }
}

export class GoToTest {
  public constructor(private system: System, private ui: UserInterface) {
    console.log('Go To Test Loaded!');
  }

  public activate(context: ExtensionContext) {
    this.ui.info('Go To Test ACTIVATED!');

    const disposable = this.registerTheCommand();

    context.subscriptions.push(disposable);
  }

  private registerTheCommand() {
    return this.system.registerCommand('danyg-go-to-test.goToTest', this.executeCommand.bind(this));
  }

  public async executeCommand() {
    console.log('Go To Test executed!');
    const currentFile = this.system.getActiveTextEditorFilePath();
    const testFile = this.getTestFile(currentFile);

    await this.openFileInEditor(testFile);
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

const goToTestExtension = new GoToTest(new VsCodeSystem(), new VSCodeUI());

export const activate = goToTestExtension.activate.bind(goToTestExtension);
// export function deactivate() {}
