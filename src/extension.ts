import * as vscode from 'vscode';

console.log('Go To Test Loaded!');

export function activate(context: vscode.ExtensionContext) {
  console.log('Go To Test ACTIVATED!');
  vscode.window.showInformationMessage('Go To Test ACTIVATED!');
  const disposable = vscode.commands.registerCommand('danyg-go-to-test.goToTest', async () => {
    console.log('Go To Test executed!');
    const currentFile = vscode.window.activeTextEditor!.document.fileName;
    const testFile = currentFile.replace(
      /^(?<projectPath>.*)src(?<moduleInternalPath>.*)\.(?<ext>[tj]sx?)$/,
      '$<projectPath>test$<moduleInternalPath>.test.$<ext>'
    );

    try {
      console.log(`Opening: ${testFile}`);
      vscode.window.showInformationMessage(`Opening: ${testFile}`);
      const doc: vscode.TextDocument = await vscode.workspace.openTextDocument(
        vscode.Uri.file(testFile)
      );
      await vscode.window.showTextDocument(doc);
      vscode.window.showInformationMessage(`${testFile} Opened`);
      console.log(`Opened!`);
    } catch (e) {
      console.error(`Error occurred!`, e);
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
