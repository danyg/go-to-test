import UserInterface from '../interfaces/user-interface';
import { VSCodeWindow, GoToTestVsCodeNS } from './types';

export default class VSCodeUI implements UserInterface {
  private static PREFIX = 'Go To Test Extension: ';
  public static getInstance(vscode: GoToTestVsCodeNS) {
    return new VSCodeUI(vscode.window);
  }

  private constructor(private vscodeWindow: VSCodeWindow) {}

  info(message: string): void {
    console.log(`[INFO]: ${message}`);
    this.vscodeWindow.showInformationMessage(`${VSCodeUI.PREFIX}${message}`);
  }

  public async alertUserOfError(error: Error): Promise<void> {
    console.log(`[ERROR]: ${error.message}`);
    await this.vscodeWindow.showErrorMessage(`${VSCodeUI.PREFIX}${error.message}`);
  }
}
