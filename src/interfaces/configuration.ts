export enum Strategy {
  MAVEN,
  SAME_DIRECTORY,
  __TESTS__,
  CUSTOM
}

export interface Configuration {
  readonly strategy: Strategy;
  readonly match: RegExp;
  readonly replace: string;
}
