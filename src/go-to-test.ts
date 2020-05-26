import { ExtensionContext } from './interfaces/disposable';
import System from './interfaces/system';
import UserInterface from './interfaces/user-interface';
import Configuration, { StrategyOption } from './interfaces/configuration';
import Strategy from './interfaces/strategy';
import MavenStrategy from './strategies/maven-strategy';
import MavenLikeStrategy from './strategies/maven-like-strategy';
import SameDirectoryStrategy from './strategies/same-directory-strategy';
import UUTestsUUStrategy from './strategies/__tests__-strategy';
import CustomStrategy from './strategies/custom-strategy';

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

    console.log('Go To Test Loaded!');
  }

  public activate(context: ExtensionContext) {
    const disposable = this.registerTheCommand();
    context.subscriptions.push(disposable);
  }

  private registerTheCommand() {
    return this.system.registerCommand('danyg-go-to-test.goToTest', this.executeCommand.bind(this));
  }

  public async executeCommand() {
    const currentFile = this.system.getActiveTextEditorFilePath();
    if (null !== currentFile) {
      const testFilePath = this.getTestFilePath(currentFile);
      await this.system.openFileInEditor(testFilePath);
    }
  }

  private getCurrentStrategy(): Strategy {
    const strategy = this.strategies.get(this.configuration.strategy);

    if (strategy) {
      return strategy;
    }
    // TODO TEST ME!
    throw new Error('Given Strategy is incorrect');
  }

  private getTestFilePath(srcFilePath: string): string {
    return this.getCurrentStrategy().resolve(srcFilePath);
  }
}
