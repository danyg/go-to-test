import * as vscode from 'vscode';
import { URI } from 'vscode-uri';

interface GoToTestWorkspaceEdit {
  createFile(uri: GoToTestURI): void;
}

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
type VSCodeFileStat = vscode.FileStat;
type VSCodeFSStatFn = (uri: GoToTestURI) => Thenable<VSCodeFileStat>;
type VSCodeWorkspaceEdit = vscode.WorkspaceEdit;
type VSCodeWorkspaceApplyEditFn = typeof vscode.workspace.applyEdit;
type GoToTestWorkspaceApplyEditFn = (
  edit: GoToTestWorkspaceEdit | VSCodeWorkspaceEdit
) => Thenable<boolean>;
type GoToTestURI = URI | VSCodeURI;

type UriClass = {
  file: (str: string) => GoToTestURI;
};

export interface VSCodeFS {
  stat: VSCodeFSStatFn;
}

export interface VSCodeWindow {
  activeTextEditor: ActiveTextEditor;
  showInformationMessage: ShowInformationMessageFn;
  showErrorMessage: ShowErrorMessageFn;
  showTextDocument: ShowTextDocumentFn;
}

export interface VSCodeWorkspace {
  openTextDocument: OpenTextDocumentFn;
  getConfiguration: GetConfigurationFn;
  fs: VSCodeFS;
  applyEdit: GoToTestWorkspaceApplyEditFn;
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
  WorkspaceEdit: new () => GoToTestWorkspaceEdit;
  window: VSCodeWindow;
  workspace: VSCodeWorkspace;
  Uri: UriClass;
  commands: VSCodeCommands;
}
