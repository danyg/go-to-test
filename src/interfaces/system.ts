/* eslint-disable @typescript-eslint/no-explicit-any */
import { Disposable } from './disposable';

type Command = (...args: any[]) => any;

export interface System {
  registerCommand(command: string, callback: Command, thisArg?: any): Disposable;
  getActiveTextEditorFilePath(): string;
  openFileInEditor(filePath: string): Promise<any>;
}
