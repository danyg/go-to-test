import Configuration, { StrategyOption } from '../interfaces/configuration';
import { GetConfigurationFn, GoToTestVsCodeNS } from './types';

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
  public static getInstance(vscode: GoToTestVsCodeNS) {
    return new VSCodeConfiguration(vscode.workspace.getConfiguration);
  }
  public static SECTIONS = SECTIONS;

  private constructor(private getConfiguration: GetConfigurationFn) {}

  public get strategy(): StrategyOption {
    const defaultValue = StrategyOption.MAVEN_LIKE;
    if (this.getConfiguration().has(SECTIONS.STRATEGY)) {
      const strategyConfig: string = this.getConfiguration().get(SECTIONS.STRATEGY) ?? '';
      return strategyConfigToStrategyOption.get(strategyConfig) ?? defaultValue;
    }
    return defaultValue;
  }

  public get match(): RegExp {
    const defaultValue = /^(?<projectPath>.*)src(?<moduleInternalPath>.*)\\.(?<ext>[tj]sx?)$/;
    if (!this.getConfiguration().has(SECTIONS.MATCH)) {
      return defaultValue;
    }
    return new RegExp(this.getConfiguration().get('goToTest.match') ?? '');
  }

  public get replace(): string {
    return this.getConfiguration().get('goToTest.replace') ?? '';
  }
}
