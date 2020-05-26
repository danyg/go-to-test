// import * as expect from 'expect';
import { when, anyString, verify, instance, capture } from 'ts-mockito';
import UserInterface from '../src/interfaces/user-interface';
import UIMock from './mocks/ui-mock';
import SystemMock from './mocks/system-mock';
import System from '../src/interfaces/system';
import GoToTest from '../src/go-to-test';
import { ConfigurationDouble } from './mocks/configuration-double';
import { StrategyOption } from '../src/interfaces/configuration';
import * as expect from 'expect';

describe('GoToTest', () => {
  it('should do nothing WHEN command is triggered and there is no active editor', async () => {
    const testSubject = buildTestSubject();
    when(SystemMock.getActiveTextEditorFilePath()).thenReturn(null);

    await testSubject.executeCommand();

    verify(SystemMock.openFileInEditor(anyString())).never();
  });

  describe('Maven Strategy', () => {
    it('should use maven strategy WHEN the configuration says so', async () => {
      const testSubject = buildTestSubject(
        ConfigurationDouble.getInstance().withStrategy(StrategyOption.MAVEN)
      );
      when(SystemMock.getActiveTextEditorFilePath()).thenReturn(
        '/src/main/java/com/company/package/MyClass.java'
      );

      await testSubject.executeCommand();

      const [firstArg] = capture(SystemMock.openFileInEditor).last();
      expect(firstArg).toEqual('/src/test/java/com/company/package/MyClassTest.java');
    });
  });

  describe('Maven Like Strategy', () => {
    it('should use maven-like strategy WHEN the configuration says so', async () => {
      const testSubject = buildTestSubject(
        ConfigurationDouble.getInstance().withStrategy(StrategyOption.MAVEN_LIKE)
      );
      when(SystemMock.getActiveTextEditorFilePath()).thenReturn(
        '/src/module/sub-module/sub-sub-module/my-file.js'
      );

      await testSubject.executeCommand();

      const [firstArg] = capture(SystemMock.openFileInEditor).last();
      expect(firstArg).toEqual('/test/module/sub-module/sub-sub-module/my-file.test.js');
    });

    it('should use the nested `src` directory as projectPath', async () => {
      const testSubject = buildTestSubject(
        ConfigurationDouble.getInstance().withStrategy(StrategyOption.MAVEN_LIKE)
      );
      when(SystemMock.getActiveTextEditorFilePath()).thenReturn(
        '/src/module/src/sub-module/src/sub-sub-module/src/libs/my-file.js'
      );

      await testSubject.executeCommand();

      const [firstArg] = capture(SystemMock.openFileInEditor).last();
      expect(firstArg).toEqual(
        '/src/module/src/sub-module/src/sub-sub-module/test/libs/my-file.test.js'
      );
    });

    it('should work with any extension', async () => {
      const testSubject = buildTestSubject(
        ConfigurationDouble.getInstance().withStrategy(StrategyOption.MAVEN_LIKE)
      );
      when(SystemMock.getActiveTextEditorFilePath()).thenReturn(
        '/src/libs/my-file.thisIsAVerboseExtension'
      );

      await testSubject.executeCommand();

      const [firstArg] = capture(SystemMock.openFileInEditor).last();
      expect(firstArg).toEqual('/test/libs/my-file.test.thisIsAVerboseExtension');
    });
  });

  describe('Same Directory Strategy', () => {
    it('should use same-directory strategy WHEN the configuration says so', async () => {
      const testSubject = buildTestSubject(
        ConfigurationDouble.getInstance().withStrategy(StrategyOption.SAME_DIRECTORY)
      );
      when(SystemMock.getActiveTextEditorFilePath()).thenReturn(
        '/src/module/sub-module/sub-sub-module/my-file.js'
      );

      await testSubject.executeCommand();

      const [firstArg] = capture(SystemMock.openFileInEditor).last();
      expect(firstArg).toEqual('/src/module/sub-module/sub-sub-module/my-file.test.js');
    });
  });

  describe('__TESTS__ Strategy', () => {
    it('should use __TESTS__ strategy WHEN the configuration says so', async () => {
      const testSubject = buildTestSubject(
        ConfigurationDouble.getInstance().withStrategy(StrategyOption.__TESTS__)
      );
      when(SystemMock.getActiveTextEditorFilePath()).thenReturn(
        '/src/module/sub-module/sub-sub-module/my-file.js'
      );

      await testSubject.executeCommand();

      const [firstArg] = capture(SystemMock.openFileInEditor).last();
      expect(firstArg).toEqual('/src/module/sub-module/sub-sub-module/__tests__/my-file.js');
    });
  });

  describe('Custom Strategy', () => {
    it('should use custom strategy WHEN the configuration says so', async () => {
      const testSubject = buildTestSubject(
        ConfigurationDouble.getInstance()
          .withStrategy(StrategyOption.CUSTOM)
          .withMatch(/(.*)\/([^\/]+)\.([\w]+)/)
          .withReplace('_TESTS_$1/$2.IntegrationTest.$3')
      );

      when(SystemMock.getActiveTextEditorFilePath()).thenReturn(
        '/src/module/sub-module/sub-sub-module/my-file.js'
      );

      await testSubject.executeCommand();

      const [firstArg] = capture(SystemMock.openFileInEditor).last();
      expect(firstArg).toEqual(
        '_TESTS_/src/module/sub-module/sub-sub-module/my-file.IntegrationTest.js'
      );
    });
  });
});

const defaultConfiguration = ConfigurationDouble.getInstance().withStrategy(
  StrategyOption.MAVEN_LIKE
);

function buildTestSubject(configuration = defaultConfiguration) {
  const system: System = instance(SystemMock);
  const ui: UserInterface = instance(UIMock);
  const testSubject = new GoToTest(system, ui, configuration);
  return testSubject;
}
