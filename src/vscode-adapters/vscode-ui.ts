import * as vscode from 'vscode';
import UserInterface from '../interfaces/user-interface';

export default class VSCodeUI implements UserInterface {
  public static getInstance() {
    return new VSCodeUI();
  }

  info(message: string): void {
    console.log(`[INFO]: ${message}`);
    vscode.window.showInformationMessage(message);
  }

  public async alertUserOfWrongStrategyOnConfiguration() {
    vscode.window.showErrorMessage(
      'Go To Test Extension: The given value on go-to-test.strategy is not valid.'
    );
  }
}
