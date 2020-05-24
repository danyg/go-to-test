import { VsCodeSystem } from './vscode-adapters/vscode-system';
import { VSCodeUI } from './vscode-adapters/vscode-ui';
import { GoToTest } from './go-to-test';
import { Configuration, StrategyOption } from './interfaces/configuration';

const configMock: Configuration = {
  strategy: StrategyOption.MAVEN,
  match: /nop/,
  replace: 'nop'
};

const goToTestExtension = new GoToTest(new VsCodeSystem(), new VSCodeUI(), configMock);

export const activate = goToTestExtension.activate.bind(goToTestExtension);
// export function deactivate() {}
