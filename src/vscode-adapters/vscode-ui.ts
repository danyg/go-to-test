import UserInterface from '../interfaces/user-interface';
import { VSCodeWindow } from './types';
import { StrategyResolveError } from '../exceptions/strategy-resolve-error';

export default class VSCodeUI implements UserInterface {
  private static PREFIX = 'Go To Test Extension: ';
  public static getInstance(vscodeWindow: VSCodeWindow) {
    return new VSCodeUI(vscodeWindow);
  }

  private constructor(private vscodeWindow: VSCodeWindow) {}

  info(message: string): void {
    console.log(`[INFO]: ${message}`);
    this.vscodeWindow.showInformationMessage(`${VSCodeUI.PREFIX}${message}`);
  }

  public async alertUserOfError(error: StrategyResolveError): Promise<void> {
    console.log(`[ERROR]: ${error.message}`);
    await this.vscodeWindow.showErrorMessage(`${VSCodeUI.PREFIX}${error.message}`);
  }
}
