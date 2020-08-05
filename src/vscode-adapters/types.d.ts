import * as vscode from 'vscode';

// type alias
type RegisterCommandFn = typeof vscode.commands.registerCommand;
type StringToVSCodeURIFn = typeof vscode.Uri.file;
type VSCodeURI = vscode.Uri;
type VSCodeTextDocument = vscode.TextDocument;
type VSCodeTextEditor = vscode.TextEditor;
type VSCodeDisposable = vscode.Disposable;

export interface VSCodeWindow {
  showInformationMessage: typeof vscode.window.showInformationMessage;
  showErrorMessage: typeof vscode.window.showErrorMessage;
}

export interface VSCodeEditor {
  activeTextEditor: vscode.TextEditor | undefined;
  openTextDocument: typeof vscode.workspace.openTextDocument;
  showTextDocument: typeof vscode.window.showTextDocument;
}

export interface VSCodeSystemIO {
  registerCommand: RegisterCommandFn;
  stringToURI: StringToVSCodeURIFn;
}
