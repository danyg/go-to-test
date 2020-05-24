import * as vscode from 'vscode';
import { UserInterface } from './user-interface';

export class VSCodeUI implements UserInterface {
  info(message: string): void {
    console.log(`[INFO]: ${message}`);
    vscode.window.showInformationMessage(message);
  }
}
