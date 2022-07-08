import Configuration, { StrategyOption } from 'interfaces/configuration';

export class ConfigurationDouble implements Configuration {
  static getInstance() {
    return new ConfigurationDouble();
  }

  private _strategy!: StrategyOption;
  private _match!: RegExp;
  private _replace!: string;
  private _sourcePattern!: string;
  private _testPattern!: string;

  public get strategy(): StrategyOption {
    return this._strategy;
  }

  public get match(): RegExp {
    return this._match;
  }

  public get replace(): string {
    return this._replace;
  }

  public get sourcePattern(): string {
    return this._sourcePattern;
  }

  public get testPattern(): string {
    return this._testPattern;
  }

  withStrategy(strategy: StrategyOption) {
    this._strategy = strategy;
    return this;
  }

  withInvalidStrategy() {
    this._strategy = 88;
    return this;
  }

  withMatch(match: RegExp) {
    this._match = match;
    return this;
  }

  withReplace(replace: string) {
    this._replace = replace;
    return this;
  }

  withCustomSourcePattern(sourcePattern: string) {
    this._sourcePattern = sourcePattern;
    return this;
  }

  withCustomTestPattern(testPattern: string) {
    this._testPattern = testPattern;
    return this;
  }
}
