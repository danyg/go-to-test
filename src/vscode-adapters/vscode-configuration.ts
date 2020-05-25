import Configuration, { StrategyOption } from '../interfaces/configuration';
import * as vscode from 'vscode';

const SECTIONS = {
  STRATEGY: 'goToTest.strategy',
  MATCH: 'goToTest.match',
  REPLACE: 'goToTest.replace'
};

const strategyConfigToStrategyOption = new Map<string, StrategyOption>([
  ['maven-like', StrategyOption.MAVEN_LIKE],
  ['maven', StrategyOption.MAVEN],
  ['same-directory', StrategyOption.SAME_DIRECTORY],
  ['__tests__', StrategyOption.__TESTS__],
  ['custom', StrategyOption.CUSTOM]
]);

export default class VSCodeConfiguration implements Configuration {
  public static getInstance() {
    return new VSCodeConfiguration();
  }
  public static SECTIONS = SECTIONS;

  public get strategy(): StrategyOption {
    const defaultValue = StrategyOption.MAVEN_LIKE;
    if (this.config().has(SECTIONS.STRATEGY)) {
      const strategyConfig: string = this.config().get(SECTIONS.STRATEGY) ?? '';
      return strategyConfigToStrategyOption.get(strategyConfig) ?? defaultValue;
    }
    return defaultValue;
  }

  public get match(): RegExp {
    const defaultValue = /^(?<projectPath>.*)src(?<moduleInternalPath>.*)\\.(?<ext>[tj]sx?)$/;
    if (!this.config().has(SECTIONS.MATCH)) {
      return defaultValue;
    }
    return new RegExp(this.config().get('goToTest.match') ?? '');
  }

  public get replace(): string {
    return this.config().get('goToTest.replace') ?? '';
  }

  private config(): vscode.WorkspaceConfiguration {
    return vscode.workspace.getConfiguration();
  }
}
