import System, { Command } from 'interfaces/system';
import { Disposable } from 'interfaces/disposable';

type ActiveFilePath = string | null;

const NOT_SET_STRING = '___NOT___SETTED___';

class SystemDouble implements System {
  private commands: Record<string, Command> = {};
  private getActiveTextEditorFilePathResponse: ActiveFilePath = NOT_SET_STRING;
  private __OpenedFilePath: string = NOT_SET_STRING;
  private __CreatedFile: string = NOT_SET_STRING;
  private __filesThatDoNotExists: string[] = [];

  public registerCommand(command: string, callback: Command, thisArg?: any): Disposable {
    this.commands[command] = callback;
    return { dispose: () => {} };
  }

  public getActiveTextEditorFilePath(): ActiveFilePath {
    if (this.getActiveTextEditorFilePathResponse === NOT_SET_STRING) {
      throw new Error(
        'getActiveTextEditorFilePath answer has not been set, call __On_getActiveTextEditorFilePath before.'
      );
    }

    return this.getActiveTextEditorFilePathResponse;
  }

  public async openFileInEditor(filePath: string): Promise<void> {
    this.__OpenedFilePath = filePath;
  }

  public async createFile(filePath: string) {
    this.__CreatedFile = filePath;
  }

  public async fileExists(filePath: string) {
    if (this.__filesThatDoNotExists.includes(filePath)) {
      return false;
    }
    return true;
  }

  public async __ExecuteCommand(command: string) {
    if (!(command in this.commands)) {
      throw new Error(`Command "${command}" Has not been. TEST FAILED!`);
    }

    return await this.commands[command]();
  }

  public __On_getActiveTextEditorFilePath(answer: ActiveFilePath) {
    this.getActiveTextEditorFilePathResponse = answer;
  }

  public __IS_NOT_OpenedFilePath(): boolean {
    return this.__OpenedFilePath === NOT_SET_STRING;
  }

  public __Get_OpenedFilePath(): string {
    if (this.__IS_NOT_OpenedFilePath()) {
      throw new Error('System.openFileInEditor was not called as expected. FAILED TEST!');
    }

    return this.__OpenedFilePath;
  }

  public __IS_NOT_CreatedFilePath(): boolean {
    return this.__CreatedFile === NOT_SET_STRING;
  }

  public __Assert_createFile_Was_Called() {
    if (this.__IS_NOT_CreatedFilePath()) {
      throw new Error('System.createFile was not called as expected. FAILED TEST!');
    }
  }

  public __Get_CreatedFilePath(): string {
    return this.__CreatedFile;
  }

  public __Tag_File_As_Not_Existant(filePath: string) {
    this.__filesThatDoNotExists.push(filePath);
  }
}

export default SystemDouble;
