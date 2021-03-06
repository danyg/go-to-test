import { verify, instance, anyOfClass, capture, resetCalls } from 'ts-mockito';
import * as expect from 'expect';

import GoToTest from '../../src/core/go-to-test';
import UserInterface from '../../src/interfaces/user-interface';
import { ExtensionContext } from '../../src/interfaces/disposable';
import Configuration, { StrategyOption } from '../../src/interfaces/configuration';

import UIMock from '../../test-helpers/mocks/ui-mock';
import SystemDouble from '../../test-helpers/mocks/system-double';
import { ConfigurationDouble } from '../../test-helpers/mocks/configuration-double';
import { StrategyResolveError } from '../../src/exceptions/strategy-resolve-error';

describe('GoToTest', () => {
  it('should do nothing WHEN command is triggered and there is no active editor', async () => {
    const { given, when, then } = TestBuilder.build();
    given.anyConfiguration().and.theUserHaveNotOpenedAnyFileYet();

    await when.goToTestIsActioned();

    then.nothingIsDone();
  });

  describe('Maven Strategy', () => {
    it('should use maven strategy WHEN the configuration says so', async () => {
      const { given, when, then } = TestBuilder.build();
      given
        .theFollowingConfiguration(
          ConfigurationDouble.getInstance().withStrategy(StrategyOption.MAVEN)
        )
        .and.theUserOpens('/src/main/java/com/company/package/MyClass.java');

      await when.goToTestIsActioned();

      then.theTestFile('/src/test/java/com/company/package/MyClassTest.java').isOpened();
    });

    it('should use the nested `main` directory as projectPath', async () => {
      const { given, when, then } = TestBuilder.build();
      given
        .theFollowingConfiguration(
          ConfigurationDouble.getInstance().withStrategy(StrategyOption.MAVEN)
        )
        .and.theUserOpens(
          '/home/dev/src/main/theProject/src/main/java/com/company/package/MyClass.java'
        );

      await when.goToTestIsActioned();

      then
        .theTestFile(
          '/home/dev/src/main/theProject/src/test/java/com/company/package/MyClassTest.java'
        )
        .isOpened();
    });

    it('should use the nested `main` directory as package name', async () => {
      const { given, when, then } = TestBuilder.build();
      given
        .theFollowingConfiguration(
          ConfigurationDouble.getInstance().withStrategy(StrategyOption.MAVEN)
        )
        .and.theUserOpens(
          '/home/dev/src/main/theProject/src/main/java/com/company/main/package/MyClass.java'
        );

      await when.goToTestIsActioned();

      then
        .theTestFile(
          '/home/dev/src/main/theProject/src/test/java/com/company/main/package/MyClassTest.java'
        )
        .isOpened();
    });

    it('should use the nested `main` directory as package name in Windows Style', async () => {
      const { given, when, then } = TestBuilder.build();
      given
        .theFollowingConfiguration(
          ConfigurationDouble.getInstance().withStrategy(StrategyOption.MAVEN)
        )
        .and.theUserOpens(
          'C:\\Projects\\src\\main\\theProject\\src\\main\\java\\com\\company\\main\\package\\MyClass.java'
        );

      await when.goToTestIsActioned();

      then
        .theTestFile(
          'C:\\Projects\\src\\main\\theProject\\src\\test\\java\\com\\company\\main\\package\\MyClassTest.java'
        )
        .isOpened();
    });
  });

  describe('Maven Like Strategy', () => {
    it('should use maven-like strategy WHEN the configuration says so', async () => {
      const { given, when, then } = TestBuilder.build();
      given
        .theFollowingConfiguration(
          ConfigurationDouble.getInstance().withStrategy(StrategyOption.MAVEN_LIKE)
        )
        .and.theUserOpens('/src/module/sub-module/sub-sub-module/my-file.js');

      await when.goToTestIsActioned();

      then.theTestFile('/test/module/sub-module/sub-sub-module/my-file.test.js').isOpened();
    });

    it('should use the nested `src` directory as projectPath', async () => {
      const { given, when, then } = TestBuilder.build();
      given
        .theFollowingConfiguration(
          ConfigurationDouble.getInstance().withStrategy(StrategyOption.MAVEN_LIKE)
        )
        .and.theUserOpens('/src/module/src/sub-module/src/sub-sub-module/src/libs/my-file.js');

      await when.goToTestIsActioned();

      then
        .theTestFile('/src/module/src/sub-module/src/sub-sub-module/test/libs/my-file.test.js')
        .isOpened();
    });

    it('should use the nested `src` directory as projectPath with Windows Paths', async () => {
      const { given, when, then } = TestBuilder.build();
      given
        .theFollowingConfiguration(
          ConfigurationDouble.getInstance().withStrategy(StrategyOption.MAVEN_LIKE)
        )
        .and.theUserOpens(
          'C:\\Project\\src\\module\\src\\sub-module\\src\\sub-sub-module\\src\\libs\\my-file.js'
        );

      await when.goToTestIsActioned();

      then
        .theTestFile(
          'C:\\Project\\src\\module\\src\\sub-module\\src\\sub-sub-module\\test\\libs\\my-file.test.js'
        )
        .isOpened();
    });

    it('should work with any extension', async () => {
      const { given, when, then } = TestBuilder.build();
      given
        .theFollowingConfiguration(
          ConfigurationDouble.getInstance().withStrategy(StrategyOption.MAVEN_LIKE)
        )
        .and.theUserOpens('/src/libs/my-file.thisIsAVerboseExtension');

      await when.goToTestIsActioned();

      then.theTestFile('/test/libs/my-file.test.thisIsAVerboseExtension').isOpened();
    });
  });

  describe('Same Directory Strategy', () => {
    it('should use same-directory strategy WHEN the configuration says so', async () => {
      const { given, when, then } = TestBuilder.build();
      given
        .theFollowingConfiguration(
          ConfigurationDouble.getInstance().withStrategy(StrategyOption.SAME_DIRECTORY)
        )
        .and.theUserOpens('/src/module/sub-module/sub-sub-module/my-file.js');

      await when.goToTestIsActioned();

      then.theTestFile('/src/module/sub-module/sub-sub-module/my-file.test.js').isOpened();
    });

    it('should use same-directory strategy WHEN the configuration says so and it works with Windows Paths', async () => {
      const { given, when, then } = TestBuilder.build();
      given
        .theFollowingConfiguration(
          ConfigurationDouble.getInstance().withStrategy(StrategyOption.SAME_DIRECTORY)
        )
        .and.theUserOpens('C:\\Project\\src\\module\\sub-module\\sub-sub-module\\my-file.js');

      await when.goToTestIsActioned();

      then
        .theTestFile('C:\\Project\\src\\module\\sub-module\\sub-sub-module\\my-file.test.js')
        .isOpened();
    });
  });

  describe('__TESTS__ Strategy', () => {
    it('should use __TESTS__ strategy WHEN the configuration says so', async () => {
      const { given, when, then } = TestBuilder.build();
      given
        .theFollowingConfiguration(
          ConfigurationDouble.getInstance().withStrategy(StrategyOption.__TESTS__)
        )
        .and.theUserOpens('/src/module/sub-module/sub-sub-module/my-file.js');

      await when.goToTestIsActioned();

      then.theTestFile('/src/module/sub-module/sub-sub-module/__tests__/my-file.js').isOpened();
    });

    it('should use __TESTS__ strategy WHEN the configuration says so and it works with Windows Paths', async () => {
      const { given, when, then } = TestBuilder.build();
      given
        .theFollowingConfiguration(
          ConfigurationDouble.getInstance().withStrategy(StrategyOption.__TESTS__)
        )
        .and.theUserOpens('C:\\Project\\src\\module\\sub-module\\sub-sub-module\\my-file.js');

      await when.goToTestIsActioned();

      then
        .theTestFile('C:\\Project\\src\\module\\sub-module\\sub-sub-module\\__tests__\\my-file.js')
        .isOpened();
    });
  });

  describe('Custom Strategy', () => {
    it('should use custom strategy WHEN the configuration says so', async () => {
      const { given, when, then } = TestBuilder.build();
      given
        .theFollowingConfiguration(
          ConfigurationDouble.getInstance()
            .withStrategy(StrategyOption.CUSTOM)
            .withMatch(/(.*)\/([^\/]+)\.([\w]+)/)
            .withReplace('$1/testGoesHere/$2.IntegrationTest.$3')
        )
        .and.theUserOpens('/src/module/sub-module/sub-sub-module/my-file.js');

      await when.goToTestIsActioned();

      then
        .theTestFile(
          '/src/module/sub-module/sub-sub-module/testGoesHere/my-file.IntegrationTest.js'
        )
        .isOpened();
    });

    it('should abstract the user to handle Windows Paths and focus in linux way', async () => {
      const { given, when, then } = TestBuilder.build();
      given
        .theFollowingConfiguration(
          ConfigurationDouble.getInstance()
            .withStrategy(StrategyOption.CUSTOM)
            .withMatch(/(.*)\/([^\/]+)\.([\w]+)/)
            .withReplace('$1/testGoesHere/$2.IntegrationTest.$3')
        )
        .and.theUserOpens('C:\\Projects\\src\\module\\sub-module\\sub-sub-module\\my-file.js');

      await when.goToTestIsActioned();

      then
        .theTestFile(
          'C:\\Projects\\src\\module\\sub-module\\sub-sub-module\\testGoesHere\\my-file.IntegrationTest.js'
        )
        .isOpened();
    });

    it("should handle with an error WHEN the given regexp doesn't produce any match", async () => {
      const { given, when, then, util } = TestBuilder.build();
      const badRegExpConfig = /@#~@~@@~@(.*)\/([^\/]+)\.([\w]+)/;
      const openedSourceCode = '/src/module/sub-module/sub-sub-module/my-file.js';
      given
        .theFollowingConfiguration(
          ConfigurationDouble.getInstance()
            .withStrategy(StrategyOption.CUSTOM)
            .withMatch(badRegExpConfig)
            .withReplace('testGoesHere$1/$2.IntegrationTest.$3')
        )
        .and.theUserOpens(openedSourceCode);

      await when.goToTestIsActioned();

      then.userIsInformedAboutAnError();
      const error: StrategyResolveError = util.getAlertUserOfErrorLastArgument();
      expect(error.message).toEqual(
        `Could not match RegExp: "${badRegExpConfig.toString()}" With file path: "${openedSourceCode}". Please ensure settings.json "go-to-test.match" is a valid RegExp and will match as expected.`
      );
    });
  });

  describe('Invalid strategy', () => {
    it('should alert the user of an error when there is an invalid strategy set in the settings.json', async () => {
      const { given, when, then, util } = TestBuilder.build();
      given
        .theFollowingConfiguration(ConfigurationDouble.getInstance().withInvalidStrategy())
        .and.theUserOpens('/src/my-file.js');

      await when.goToTestIsActioned();

      then.userIsInformedAboutAnError();
      const error: Error = util.getAlertUserOfErrorLastArgument();
      expect(error.message).toEqual(
        `The given value on settings.json for "go-to-test.strategy" is INVALID.`
      );
    });
  });
});

const defaultConfiguration = ConfigurationDouble.getInstance().withStrategy(
  StrategyOption.MAVEN_LIKE
);

// function

class TestBuilder {
  public static build() {
    const test = new TestBuilder();
    return {
      given: test,
      when: test,
      then: test,
      util: test
    };
  }

  private testSubject!: GoToTest;
  private testFilePath!: string;
  private system!: SystemDouble;
  private ui!: UserInterface;
  private context!: ExtensionContext;

  private constructor() {}

  get and() {
    return this;
  }

  private buildTestSubject(configuration: Configuration = defaultConfiguration) {
    resetCalls(UIMock);
    this.system = new SystemDouble();
    this.ui = instance(UIMock);
    this.testSubject = new GoToTest(this.system, this.ui, configuration);
  }

  private getContextDouble(): ExtensionContext {
    return {
      subscriptions: []
    };
  }

  // Given
  public anyConfiguration() {
    this.buildTestSubject();
    this.context = this.getContextDouble();

    this.testSubject.activate(this.context);

    return this;
  }

  public theFollowingConfiguration(configuration: Configuration) {
    this.buildTestSubject(configuration);
    this.context = this.getContextDouble();

    this.testSubject.activate(this.context);

    return this;
  }

  public theUserOpens(sourceFilePath: string) {
    this.system.__On_getActiveTextEditorFilePath(sourceFilePath);
    return this;
  }

  public theUserHaveNotOpenedAnyFileYet() {
    this.system.__On_getActiveTextEditorFilePath(null);
    return this;
  }

  // When

  public async goToTestIsActioned() {
    await this.system.__ExecuteCommand('danyg-go-to-test.goToTest');
  }

  // Then

  public theTestFile(filePath: string) {
    this.testFilePath = filePath;

    return this;
  }

  public isOpened() {
    const openedFile = this.system.__Get_OpenedFilePath();
    expect(openedFile).toEqual(this.testFilePath);

    return this;
  }

  public nothingIsDone() {
    expect(this.system.__IS_NOT_OpenedFilePath()).toBe(true);

    return this;
  }

  public userIsInformedAboutAnError() {
    verify(UIMock.alertUserOfError(anyOfClass(Error))).once();

    return this;
  }

  // Other Helpers
  public getAlertUserOfErrorLastArgument(): Error {
    const [error] = capture(UIMock.alertUserOfError).last();
    return error;
  }
}
