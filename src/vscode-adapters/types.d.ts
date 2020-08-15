import * as vscode from 'vscode';

// type alias
type RegisterCommandFn = typeof vscode.commands.registerCommand;
type StringToVSCodeURIFn = typeof vscode.Uri.file;
type VSCodeURI = vscode.Uri;
type VSCodeTextDocument = vscode.TextDocument;
type VSCodeTextEditor = vscode.TextEditor;
type VSCodeDisposable = vscode.Disposable;
type OpenTextDocumentFn = typeof vscode.workspace.openTextDocument;
type ShowTextDocumentFn = typeof vscode.window.showTextDocument;
type ShowErrorMessageFn = typeof vscode.window.showErrorMessage;
type ShowInformationMessageFn = typeof vscode.window.showInformationMessage;
type ActiveTextEditor = vscode.TextEditor | undefined;

export type GoToTestVsCodeNS = {
  window: VSCodeWindow;
  workspace: {
    openTextDocument: OpenTextDocumentFn;
  };
  Uri: {
    file: typeof vscode.Uri.file;
  };
  commands: {
    registerCommand: RegisterCommandFn;
  };
};

export interface VSCodeWindow {
  activeTextEditor: ActiveTextEditor;
  showInformationMessage: ShowInformationMessageFn;
  showErrorMessage: ShowErrorMessageFn;
  showTextDocument: ShowTextDocumentFn;
}

export interface VSCodeEditor {
  activeTextEditor: ActiveTextEditor;
  openTextDocument: OpenTextDocumentFn;
  showTextDocument: ShowTextDocumentFn;
}

export interface VSCodeSystemIO {
  registerCommand: RegisterCommandFn;
  stringToURI: StringToVSCodeURIFn;
}
