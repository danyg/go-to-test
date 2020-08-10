import UserInterface from '../interfaces/user-interface';
import { VSCodeWindow } from './types';

export default class VSCodeUI implements UserInterface {
  public static getInstance(vscodeWindow: VSCodeWindow) {
    return new VSCodeUI(vscodeWindow);
  }

  private constructor(private vscodeWindow: VSCodeWindow) {}

  info(message: string): void {
    console.log(`[INFO]: ${message}`);
    this.vscodeWindow.showInformationMessage(message);
  }

  public async alertUserOfWrongStrategyOnConfiguration() {
    this.vscodeWindow.showErrorMessage(
      'Go To Test Extension: The given value on go-to-test.strategy is not valid.'
    );
  }
}
