// import * as expect from 'expect';
import { when, anyString, verify, instance, capture } from 'ts-mockito';
import { UserInterface } from '../src/interfaces/user-interface';
import UIMock from './mocks/ui-mock';
import SystemMock from './mocks/system-mock';
import { System } from '../src/interfaces/system';
import { GoToTest } from '../src/go-to-test';
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
      when(SystemMock.getActiveTextEditorFilePath()).thenReturn('/src/my-file.js');

      await testSubject.executeCommand();

      const [firstArg] = capture(SystemMock.openFileInEditor).last();
      expect(firstArg).toEqual('/test/my-file.test.js');
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
