import System from '../interfaces/system';
import {
  VSCodeEditor,
  RegisterCommandFn,
  VSCodeURI,
  VSCodeTextDocument,
  VSCodeSystemIO
} from './types';

export default class VsCodeSystem implements System {
  public static getInstance(editor: VSCodeEditor, sysIo: VSCodeSystemIO) {
    return new VsCodeSystem(editor, sysIo);
  }

  private constructor(private editor: VSCodeEditor, private sysIo: VSCodeSystemIO) {
    this.registerCommand = sysIo.registerCommand;
  }

  public registerCommand: RegisterCommandFn;

  public getActiveTextEditorFilePath(): string | null {
    if (!this.editor.activeTextEditor) {
      return null;
    }

    return this.editor.activeTextEditor.document.fileName;
  }

  public async openFileInEditor(filePath: string) {
    const uri: VSCodeURI = this.sysIo.stringToURI(filePath);
    const p = this.editor.openTextDocument(uri);
    console.log(p);
    const doc: VSCodeTextDocument = await p;
    await this.editor.showTextDocument(doc);
  }
}
