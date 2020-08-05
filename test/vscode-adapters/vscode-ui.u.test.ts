import { mock, instance, verify } from 'ts-mockito';
import { VSCodeWindow } from '../../src/vscode-adapters/types';
import VSCodeUI from '../../src/vscode-adapters/vscode-ui';

/**
 * **NOTE**
 * Take in account that these tests are IMPLEMENTATION / CONTRACT tests are
 * they are coupled to vscode current api and it's testing some logic but
 * mainly that are properly coupled to current (July 2020) VSCODE API
 * design
 **/

describe('vscode-ui', () => {
  let vscodeWindowMock: VSCodeWindow;
  let testSubject: VSCodeUI;

  beforeEach(() => {
    vscodeWindowMock = mock<VSCodeWindow>();
  });

  it('info: should call showInformationMessage with given message', () => {
    const testMessage = 'This is a test message';
    testSubject = VSCodeUI.getInstance(instance(vscodeWindowMock));

    testSubject.info(testMessage);

    verify(vscodeWindowMock.showInformationMessage(testMessage)).called();
  });

  it('alertUserOfWrongStrategyOnConfiguration: should show a specific error message', () => {
    const expectedMessage =
      'Go To Test Extension: The given value on go-to-test.strategy is not valid.';
    testSubject = VSCodeUI.getInstance(instance(vscodeWindowMock));

    testSubject.alertUserOfWrongStrategyOnConfiguration();

    verify(vscodeWindowMock.showErrorMessage(expectedMessage)).called();
  });
});
