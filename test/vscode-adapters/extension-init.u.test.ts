import * as expect from 'expect';
import { instance, mock, when } from 'ts-mockito';
import { ExtensionContext } from 'vscode';
import { URI } from 'vscode-uri';
import { buildExtension } from '../../src/vscode-adapters/extension-init';
import { GoToTestVsCodeNS } from '../../src/vscode-adapters/types';
import { VSCodeNSHandler } from '../../test-helpers/mocks/vscode-ns-handler';

describe('buildExtension', () => {
  let vscodeNSHandler: VSCodeNSHandler;
  let vscodeNSMock: GoToTestVsCodeNS;
  let extensionContextMock: ExtensionContext;

  beforeEach(() => {
    vscodeNSHandler = new VSCodeNSHandler();
    vscodeNSMock = vscodeNSHandler.getNS();
    extensionContextMock = mock<ExtensionContext>();
    when(extensionContextMock.subscriptions).thenReturn([]);
  });

  it('should return activate and it should be a function', () => {
    const extension = buildExtension(vscodeNSMock);

    expect(extension.activate).toBeInstanceOf(Function);
  });

  function testStrategy({
    strategy,
    actualPath,
    expectedTestPath,
    extraConfig = []
  }: {
    strategy: string;
    actualPath: string;
    expectedTestPath: string;
    extraConfig?: Array<[string, string]>;
  }) {
    it(`[happy path] [Strategy: ${strategy}] should go to test from a source file`, async () => {
      vscodeNSHandler
        // Active Editor
        .withActiveEditor(actualPath)
        // Config
        .withConfig(
          new Map<string, string>([['goToTest.strategy', strategy], ...extraConfig])
        );

      const extension = buildExtension(vscodeNSMock);
      extension.activate(instance(extensionContextMock));
      await vscodeNSHandler.triggerVSCodeCommand('danyg-go-to-test.goToTest');

      const openTextDocArgs = vscodeNSHandler.captureOpenTextDocument().last();
      const uriUsed: URI = openTextDocArgs[0] as URI;
      expect(uriUsed.toString()).toBe(expectedTestPath);
    });
  }

  testStrategy({
    strategy: 'maven-like',
    actualPath: '/home/project/src/core/module/main.js',
    expectedTestPath: 'file:///home/project/test/core/module/main.test.js'
  });
  testStrategy({
    strategy: 'maven',
    actualPath: '/home/project/src/main/package/Main.java',
    expectedTestPath: 'file:///home/project/src/test/package/MainTest.java'
  });
  testStrategy({
    strategy: 'same-directory',
    actualPath: '/home/project/src/core/module/main.js',
    expectedTestPath: 'file:///home/project/src/core/module/main.test.js'
  });
  testStrategy({
    strategy: '__tests__',
    actualPath: '/home/project/src/core/module/main.js',
    expectedTestPath: 'file:///home/project/src/core/module/__tests__/main.js'
  });
  testStrategy({
    strategy: 'custom',
    actualPath: '/home/project/src/core/module/main.js',
    expectedTestPath: 'file:///home/project/theTests/core/module/main.js',
    extraConfig: [
      ['goToTest.match', '/(.*)src(.*)/'],
      ['goToTest.replace', '/$1theTests$2/']
    ]
  });
});
