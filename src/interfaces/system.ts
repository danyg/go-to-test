/* eslint-disable @typescript-eslint/no-explicit-any */
import { Disposable } from './disposable';

export type Command = (...args: any[]) => any;

export default interface System {
  registerCommand(command: string, callback: Command, thisArg?: any): Disposable;
  getActiveTextEditorFilePath(): string | null;
  openFileInEditor(filePath: string): Promise<any>;
}
