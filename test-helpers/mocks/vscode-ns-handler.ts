import {
  VSCodeWindow,
  VSCodeWorkspace,
  VSCodeCommands,
  GoToTestVsCodeNS,
  ActiveTextEditor,
  VSCodeTextEditor,
  VSCodeTextDocument,
  VSCodeWorkspaceConfiguration,
  ShowErrorMessageFn
} from '../../src/vscode-adapters/types';
import { mock, instance, when, anyOfClass, anything, capture } from 'ts-mockito';
import { URI } from 'vscode-uri';
import { Disposable } from '../../src/interfaces/disposable';
import { ConfigurationDouble } from './configuration-double';

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

export class VSCodeNSHandler {
  public readonly vsCodeWindowMock: VSCodeWindow;
  public readonly vsCodeWorkspaceMock: VSCodeWorkspace;
  public readonly vsCodeCommandsMock: VSCodeCommands;
  public readonly activeTextEditorMock: VSCodeTextEditor;
  public readonly newTextDocumentMock: VSCodeTextDocument;
  public readonly activeTextDocumentMock: VSCodeTextDocument;
  public readonly vscodeNSMock: GoToTestVsCodeNS;

  private commands: { [key: string]: Callback } = {};
  private configDouble!: VSCodeConfigDouble;

  public constructor() {
    this.vsCodeWindowMock = mock<VSCodeWindow>();
    this.vsCodeWorkspaceMock = mock<VSCodeWorkspace>();
    this.vsCodeCommandsMock = mock<VSCodeCommands>();

    this.activeTextEditorMock = mock<VSCodeTextEditor>();
    this.newTextDocumentMock = mock<VSCodeTextDocument>();
    this.activeTextDocumentMock = mock<VSCodeTextDocument>();

    this.vscodeNSMock = {
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

  public captureOpenTextDocument() {
    return capture(this.vsCodeWorkspaceMock.openTextDocument);
  }

  public withThrowOnShowErrorMessage() {
    this.monkeyPatchingWindowShowErrorToThrow();

    return this;
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

  private originalShowErrorMessage!: ShowErrorMessageFn;
  private monkeyPatchingWindowShowErrorToThrow() {
    this.originalShowErrorMessage = this.vscodeNSMock.window.showErrorMessage;
    this.vscodeNSMock.window.showErrorMessage = (message: string) => {
      throw new Error(`vscode.window.showErrorMessage: ${message}`);
    };
  }
}
