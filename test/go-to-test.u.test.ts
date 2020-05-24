// import * as expect from 'expect';
import { when, anyString, verify, instance } from 'ts-mockito';
import { UserInterface } from '../src/interfaces/user-interface';
import UIMock from './mocks/ui-mock';
import SystemMock from './mocks/system-mock';
import { System } from '../src/interfaces/system';
import { GoToTest } from '../src/go-to-test';

describe('this is just a test of the test', () => {
  it('should do nothing WHEN command is triggered and there is no active editor', async () => {
    const testSubject = buildTestSubject();
    when(SystemMock.getActiveTextEditorFilePath()).thenReturn(null);

    await testSubject.executeCommand();

    verify(SystemMock.openFileInEditor(anyString())).never();
  });
});

function buildTestSubject() {
  const system: System = instance(SystemMock);
  const ui: UserInterface = instance(UIMock);
  const testSubject = new GoToTest(system, ui);
  return testSubject;
}
