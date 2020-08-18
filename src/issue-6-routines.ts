import * as vscode from 'vscode';

/**
 * Code to create a file
 * TODO move to proper place
 */
export function createFile(filePath: string) {
  const workspaceEdit = new vscode.WorkspaceEdit();
  const fileURI = vscode.Uri.file(filePath);
  workspaceEdit.createFile(fileURI);
  vscode.workspace.applyEdit(workspaceEdit);
}

/**
 * Code to know if a file exists
 * TODO move to proper place
 */
export async function fileExists(filePath: string) {
  const fileURI = vscode.Uri.file(filePath);
  try {
    await vscode.workspace.fs.stat(fileURI);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Code to ask user Yes or No
 * TODO move to proper place
 */
export async function askUserYesOrNo(actionDescription: string): Promise<boolean> {
  const YES = `Yes - ${actionDescription}`;
  const NO = `No - ${actionDescription}`;
  const answer: string = (await vscode.window.showQuickPick([YES, NO])) ?? NO;

  return answer === YES;
}
