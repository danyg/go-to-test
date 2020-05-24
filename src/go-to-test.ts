import { ExtensionContext } from './interfaces/disposable';
import { System } from './interfaces/system';
import { UserInterface } from './interfaces/user-interface';

export class GoToTest {
  public constructor(private system: System, private ui: UserInterface) {
    console.log('Go To Test Loaded!');
  }

  public activate(context: ExtensionContext) {
    this.ui.info('Go To Test ACTIVATED!');
    const disposable = this.registerTheCommand();
    context.subscriptions.push(disposable);
  }

  private registerTheCommand() {
    return this.system.registerCommand('danyg-go-to-test.goToTest', this.executeCommand.bind(this));
  }

  public async executeCommand() {
    console.log('Go To Test executed!');
    const currentFile = this.system.getActiveTextEditorFilePath();
    const testFilePath = this.getTestFilePath(currentFile);
    await this.system.openFileInEditor(testFilePath);
  }

  private getTestFilePath(srcFilePath: string): string {
    return srcFilePath.replace(
      /^(?<projectPath>.*)src(?<moduleInternalPath>.*)\.(?<ext>[tj]sx?)$/,
      '$<projectPath>test$<moduleInternalPath>.test.$<ext>'
    );
  }
}
