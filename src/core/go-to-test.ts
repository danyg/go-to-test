import { ExtensionContext } from 'interfaces/disposable';
import System from 'interfaces/system';
import UserInterface from 'interfaces/user-interface';
import Configuration, { StrategyOption } from 'interfaces/configuration';
import Strategy from 'interfaces/strategy';
import MavenStrategy from 'strategies/maven-strategy';
import MavenLikeStrategy from 'strategies/maven-like-strategy';
import SameDirectoryStrategy from 'strategies/same-directory-strategy';
import UUTestsUUStrategy from 'strategies/__tests__-strategy';
import CustomStrategy from 'strategies/custom-strategy';

export default class GoToTest {
  private strategies: Map<StrategyOption, Strategy>;

  public constructor(
    private system: System,
    private ui: UserInterface,
    private configuration: Configuration
  ) {
    this.strategies = new Map<StrategyOption, Strategy>([
      [StrategyOption.MAVEN, MavenStrategy.getInstance()],
      [StrategyOption.MAVEN_LIKE, MavenLikeStrategy.getInstance()],
      [StrategyOption.SAME_DIRECTORY, SameDirectoryStrategy.getInstance()],
      [StrategyOption.__TESTS__, UUTestsUUStrategy.getInstance()],
      [StrategyOption.CUSTOM, CustomStrategy.getInstance(configuration)]
    ]);
  }

  public activate(context: ExtensionContext) {
    const disposable = this.registerTheCommand();
    context.subscriptions.push(disposable);
  }

  private registerTheCommand() {
    return this.system.registerCommand('danyg-go-to-test.goToTest', this.executeCommand.bind(this));
  }

  private async executeCommand(): Promise<void> {
    try {
      const currentFile = this.system.getActiveTextEditorFilePath();
      if (null !== currentFile) {
        const testFilePath = this.getTestFilePath(currentFile);
        await this.handleFileExistence(testFilePath);
        await this.system.openFileInEditor(testFilePath);
      }
    } catch (e) {
      this.ui.alertUserOfError(e);
    }
  }

  private async handleFileExistence(testFilePath: string) {
    const fileExists = await this.system.fileExists(testFilePath);
    if (!fileExists) {
      await this.system.createFile(testFilePath);
    }
  }

  private getCurrentStrategy(): Strategy {
    const strategy = this.strategies.get(this.configuration.strategy);

    if (strategy) {
      return strategy;
    }

    throw new Error('The given value on settings.json for "go-to-test.strategy" is INVALID.');
  }

  private getTestFilePath(srcFilePath: string): string {
    return this.getCurrentStrategy().resolve(srcFilePath);
  }
}
