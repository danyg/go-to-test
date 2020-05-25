import Configuration, { StrategyOption } from '../../src/interfaces/configuration';

export class ConfigurationDouble implements Configuration {
  static getInstance() {
    return new ConfigurationDouble();
  }

  private _strategy!: StrategyOption;
  private _match!: RegExp;
  private _replace!: string;

  public get strategy(): StrategyOption {
    return this._strategy;
  }

  public get match(): RegExp {
    return this._match;
  }

  public get replace(): string {
    return this._replace;
  }

  withStrategy(strategy: StrategyOption) {
    this._strategy = strategy;
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
}
