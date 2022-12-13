import * as expect from 'expect';

import { StrategyOption } from 'interfaces/configuration';

import { ConfigurationDouble } from 'test-helpers/mocks/configuration-double';
import { StrategyResolveError } from 'exceptions/strategy-resolve-error';
import { TestBuilder } from 'test-helpers/TestBuilder';

describe('Custom Strategy', () => {
  it('should use custom strategy WHEN the configuration says so', async () => {
    const { given, when, then } = TestBuilder.build();
    given
      .theFollowingConfiguration(
        ConfigurationDouble.getInstance()
          .withStrategy(StrategyOption.CUSTOM)
          .withMatch(/([^\\\/]+)[\\\/]([^\\\/]+)[\\\/](.+)[\\\/]([^\\\/]+)\.([\w]+)$/)
          .withCustomSourcePattern('$<directory>/$<directory>/$<moduleInternalPath>.$<ext>')
          .withCustomTestPattern(
            '$<directory>/$<directory>/testsGoesHere/$<moduleInternalPath>.$<ext>'
          )
          .withReplace('$1/$2/testsGoesHere/$3/$4.IntegrationTest.$5')
      )
      .and.theUserOpens('/src/module/sub-module/sub-sub-module/my-file.js');

    await when.goToTestIsActioned();

    then
      .theTestFile('/src/module/testsGoesHere/sub-module/sub-sub-module/my-file.IntegrationTest.js')
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

  it.skip('[WIP] should go to source file when user is editing the test file', async () => {
    const { given, when, then } = TestBuilder.build();
    given
      .theFollowingConfiguration(
        ConfigurationDouble.getInstance()
          .withStrategy(StrategyOption.CUSTOM)
          .withMatch(/(.*)\/([^\/]+)\.([\w]+)/)
          .withReplace('$1/testGoesHere/$2.IntegrationTest.$3')
      )
      .and.theUserOpens(
        '/src/module/sub-module/sub-sub-module/testGoesHere/my-file.IntegrationTest.js'
      );

    await when.goToTestIsActioned();

    then.theTestFile('/src/module/sub-module/sub-sub-module/my-file.js').isOpened();
  });
});
