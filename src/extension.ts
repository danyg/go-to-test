import VsCodeSystem from './vscode-adapters/vscode-system';
import VSCodeUI from './vscode-adapters/vscode-ui';
import GoToTest from './go-to-test';
import VSCodeConfiguration from './vscode-adapters/vscode-configuration';

const goToTestExtension = new GoToTest(
  VsCodeSystem.getInstance(),
  VSCodeUI.getInstance(),
  VSCodeConfiguration.getInstance()
);

export const activate = goToTestExtension.activate.bind(goToTestExtension);
// export function deactivate() {}
