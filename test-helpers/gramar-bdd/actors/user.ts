import * as vscode from "vscode";

export default class User {
	public static getInstance() {
		return new User();
	}

	private constructor() { }

	public async opensFile(filePath: string) {
		const basePath = vscode.workspace.workspaceFolders![0].uri;

		const file: vscode.Uri = vscode.Uri.joinPath(basePath, filePath);

		return vscode.workspace.openTextDocument(file);
	}

	public async goesToTest() {
		return vscode.commands.executeCommand("danyg-go-to-test.goToTest");
	}
}
