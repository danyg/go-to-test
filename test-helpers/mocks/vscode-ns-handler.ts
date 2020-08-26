import {
  anything,
  capture,
  instance,
  mock,
  objectContaining,
  when,
  verify,
  anyOfClass
} from 'ts-mockito';
import { URI } from 'vscode-uri';
import { Disposable } from '../../src/interfaces/disposable';
import {
  GoToTestURI,
  GoToTestVsCodeNS,
  GoToTestWorkspaceEdit,
  VSCodeCommands,
  VSCodeFS,
  VSCodeTextDocument,
  VSCodeTextEditor,
  VSCodeWindow,
  VSCodeWorkspace,
  VSCodeWorkspaceConfiguration
} from '../../src/vscode-adapters/types';

type Callback = (...args: any[]) => any;

class VSCodeConfigDouble extends Map<string, string> implements VSCodeWorkspaceConfiguration {
  readonly [key: string]: any;

  inspect<T>(
    section: string
  ):
    | {
        key: string;
        defaultValue?: T | undefined;
        globalValue?: T | undefined;
        workspaceValue?: T | undefined;
        workspaceFolderValue?: T | undefined;
        defaultLanguageValue?: T | undefined;
        globalLanguageValue?: T | undefined;
        workspaceLanguageValue?: T | undefined;
        workspaceFolderLanguageValue?: T | undefined;
        languageIds?: string[] | undefined;
      }
    | undefined {
    throw new Error('Method not implemented.');
  }
  update(
    section: string,
    value: any,
    configurationTarget?: boolean | import('vscode').ConfigurationTarget | undefined,
    overrideInLanguage?: boolean | undefined
  ): Thenable<void> {
    throw new Error('Method not implemented.');
  }
}

class WorkspaceEditDouble implements GoToTestWorkspaceEdit {
  public createdFile!: GoToTestURI;
  createFile(uri: GoToTestURI): void {
    this.createdFile = uri;
  }
}

export class VSCodeNSHandler {
  public readonly vsCodeWindowMock: VSCodeWindow;
  public readonly vsCodeWorkspaceMock: VSCodeWorkspace;
  public readonly vsCodeCommandsMock: VSCodeCommands;
  public readonly activeTextEditorMock: VSCodeTextEditor;
  public readonly newTextDocumentMock: VSCodeTextDocument;
  public readonly activeTextDocumentMock: VSCodeTextDocument;
  public readonly vscodeNSMock: GoToTestVsCodeNS;
  public readonly vscodeFSMock: VSCodeFS;

  private commands: { [key: string]: Callback } = {};
  private configDouble!: VSCodeConfigDouble;

  public constructor() {
    this.vsCodeWindowMock = mock<VSCodeWindow>();
    this.vsCodeWorkspaceMock = mock<VSCodeWorkspace>();
    this.vsCodeCommandsMock = mock<VSCodeCommands>();
    this.vscodeFSMock = mock<VSCodeFS>();

    this.activeTextEditorMock = mock<VSCodeTextEditor>();
    this.newTextDocumentMock = mock<VSCodeTextDocument>();
    this.activeTextDocumentMock = mock<VSCodeTextDocument>();

    this.vscodeNSMock = {
      WorkspaceEdit: WorkspaceEditDouble,
      window: instance(this.vsCodeWindowMock),
      workspace: instance(this.vsCodeWorkspaceMock),
      Uri: URI,
      commands: instance(this.vsCodeCommandsMock)
    };

    this.monkeyPatchingCommandsRegisterCommand();
    this.mockOpenTextDocument();
  }

  private mockOpenTextDocument() {
    const newTextDocument = instance(this.newTextDocumentMock);
    ((newTextDocument as unknown) as { then: any }).then = undefined; // TSMockito weird issue.
    when(this.vsCodeWorkspaceMock.openTextDocument(anything())).thenReturn(
      Promise.resolve(newTextDocument)
    );
  }

  public getNS(): GoToTestVsCodeNS {
    return this.vscodeNSMock;
  }

  public withActiveEditor(filePath: string | undefined) {
    when(this.vsCodeWindowMock.activeTextEditor).thenReturn(instance(this.activeTextEditorMock));

    if (filePath) {
      when(this.activeTextEditorMock.document).thenReturn(instance(this.activeTextDocumentMock));
      when(this.activeTextDocumentMock.fileName).thenReturn(filePath);
    }

    return this;
  }

  public withConfig(configMap: Map<string, string>) {
    this.configDouble = new VSCodeConfigDouble(configMap);
    when(this.vsCodeWorkspaceMock.getConfiguration()).thenReturn(this.configDouble);

    return this;
  }

  public withShowErrorMessageNeverResolved() {
    // @ts-ignore
    when(this.vsCodeWindowMock.showErrorMessage(anything())).thenReturn(new Promise(() => {}));

    return this;
  }

  public withNotExistantFilePath(filePath: string) {
    const expectedUri = URI.file(filePath);

    when(this.vscodeFSMock.stat(objectContaining({ path: expectedUri.path }))).thenReject(
      new Error('mocked error for file not found')
    );

    return this;
  }

  public captureOpenTextDocument() {
    return capture(this.vsCodeWorkspaceMock.openTextDocument);
  }

  public captureShowErrorMessage() {
    return capture(this.vsCodeWindowMock.showErrorMessage);
  }

  public captureWorkspaceApplyEdit() {
    return capture(this.vsCodeWorkspaceMock.applyEdit);
  }

  public getLastCreatedFile() {
    verify(
      this.vsCodeWorkspaceMock.applyEdit(anyOfClass<WorkspaceEditDouble>(WorkspaceEditDouble))
    ).called();

    const args = this.captureWorkspaceApplyEdit().last();
    const workspaceEdit = (args[0] as unknown) as WorkspaceEditDouble;
    return workspaceEdit.createdFile.toString();
  }

  public async triggerVSCodeCommand(cmdStr: string) {
    if (cmdStr in this.commands) {
      return Promise.resolve(this.commands[cmdStr]());
    } else {
      throw new Error(`Command "${cmdStr}" was not registered as expected!`);
    }
  }

  private monkeyPatchingCommandsRegisterCommand() {
    const disposableMock = mock<Disposable>();
    this.vscodeNSMock.commands.registerCommand = (
      command: string,
      callback: Callback,
      thisArg?: any
    ) => {
      this.commands[command] = callback;
      return instance(disposableMock);
    };
  }
}
