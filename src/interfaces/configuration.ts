export enum StrategyOption {
  MAVEN,
  MAVEN_LIKE,
  SAME_DIRECTORY,
  __TESTS__,
  CUSTOM
}

export interface Configuration {
  readonly strategy: StrategyOption;
  readonly match: RegExp;
  readonly replace: string;
}
