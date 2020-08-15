import * as vscode from 'vscode';
import { URI } from 'vscode-uri';

// type alias
type RegisterCommandFn = typeof vscode.commands.registerCommand;
type StringToVSCodeURIFn = typeof vscode.Uri.file;
type VSCodeURI = vscode.Uri;
type VSCodeTextDocument = vscode.TextDocument;
type VSCodeTextEditor = vscode.TextEditor;
type VSCodeDisposable = vscode.Disposable;
type OpenTextDocumentFn = typeof vscode.workspace.openTextDocument;
type GetConfigurationFn = typeof vscode.workspace.getConfiguration;
type ShowTextDocumentFn = typeof vscode.window.showTextDocument;
type ShowErrorMessageFn = typeof vscode.window.showErrorMessage;
type ShowInformationMessageFn = typeof vscode.window.showInformationMessage;
type ActiveTextEditor = vscode.TextEditor | undefined;
type VSCodeWorkspaceConfiguration = vscode.WorkspaceConfiguration;

type UriClass = {
  file: (str: string) => URI | VSCodeURI;
};

export interface VSCodeWindow {
  activeTextEditor: ActiveTextEditor;
  showInformationMessage: ShowInformationMessageFn;
  showErrorMessage: ShowErrorMessageFn;
  showTextDocument: ShowTextDocumentFn;
}

export interface VSCodeWorkspace {
  openTextDocument: OpenTextDocumentFn;
  getConfiguration: GetConfigurationFn;
}

export interface VSCodeCommands {
  registerCommand: RegisterCommandFn;
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

export interface GoToTestVsCodeNS {
  window: VSCodeWindow;
  workspace: VSCodeWorkspace;
  Uri: UriClass;
  commands: VSCodeCommands;
}
