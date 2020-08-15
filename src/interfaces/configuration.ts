export enum StrategyOption {
  MAVEN,
  MAVEN_LIKE,
  SAME_DIRECTORY,
  __TESTS__,
  CUSTOM,
  UNKNOWN
}

export default interface Configuration {
  readonly strategy: StrategyOption;
  readonly match: RegExp;
  readonly replace: string;
}
