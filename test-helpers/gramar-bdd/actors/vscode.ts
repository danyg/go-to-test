import * as vscode from 'vscode';

class VSCodeConfig {
  public static getInstance() {
    return new VSCodeConfig();
  }

  public withMavenLikeStrategy() {
    this.setConfig('goToTest.strategy', 'maven-like');
  }

  public withMavenStrategy() {
    this.setConfig('goToTest.strategy', 'maven');
  }

  public withSameDirectoryStrategy() {
    this.setConfig('goToTest.strategy', 'same-directory');
  }

  public withUnderscoreUnderscoreTestsUnderscoreUnderscoreStrategy() {
    this.setConfig('goToTest.strategy', '__tests__');
  }

  public withCustomStrategy() {
    this.setConfig('goToTest.strategy', 'custom');
    return this;
  }

  public andMatch(match: string) {
    this.setConfig('goToTest.match', match);
    return this;
  }

  public andReplace(replace: string) {
    this.setConfig('goToTest.replace', replace);
    return this;
  }

  private setConfig(section: string, value: string) {
    return vscode.workspace.getConfiguration().update(section, value);
  }
}

export default class VSCode {
  public static getInstance() {
    return new VSCode();
  }

  public isConfigured() {
    return VSCodeConfig.getInstance();
  }
}
