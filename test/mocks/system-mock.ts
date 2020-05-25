/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import System, { Command } from '../../src/interfaces/system';
import { Disposable } from '../../src/interfaces/disposable';
import { mock } from 'ts-mockito';

class SystemDouble implements System {
  registerCommand(command: string, callback: Command, thisArg?: any): Disposable {
    throw new Error('THIS SHOULD HAVE NOT BEEN EXECUTED, MISSING WHEN?');
  }
  getActiveTextEditorFilePath(): string | null {
    throw new Error('THIS SHOULD HAVE NOT BEEN EXECUTED, MISSING WHEN?');
  }
  openFileInEditor(filePath: string): Promise<any> {
    throw new Error('THIS SHOULD HAVE NOT BEEN EXECUTED, MISSING WHEN?');
  }
}

export default mock(SystemDouble);
