import * as vscode from 'vscode';

console.log('Go To Test Loaded!');

export function activate(context: vscode.ExtensionContext) {
	console.log('Go To Test ACTIVATED!');
	vscode.window.showInformationMessage('Go To Test ACTIVATED!');
	const disposable = vscode.commands.registerCommand('danyg-go-to-test.goToTest', () => {
		console.log('Go To Test executed!');
		const currentFile = vscode.window.activeTextEditor!.document.fileName;
		const testFile = currentFile.replace(/^(.*)\.([tj]sx?)$/, "$1.test$2");

		vscode.workspace.openTextDocument(testFile);
		// vscode.window.showInformationMessage('Hello World from Go To Test!');
		// vscode.workspace.openTextDocument(file);
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
