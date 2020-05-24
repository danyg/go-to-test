import { VsCodeSystem } from './vscode-system';
import { VSCodeUI } from './vscode-ui';
import { GoToTest } from './go-to-test';

const goToTestExtension = new GoToTest(new VsCodeSystem(), new VSCodeUI());

export const activate = goToTestExtension.activate.bind(goToTestExtension);
// export function deactivate() {}
