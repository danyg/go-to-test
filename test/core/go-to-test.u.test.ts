import * as expect from 'expect';

import { StrategyOption } from 'interfaces/configuration';

import { ConfigurationDouble } from 'test-helpers/mocks/configuration-double';
import { TestBuilder } from 'test-helpers/TestBuilder';

describe('GoToTest', () => {
  it('should do nothing WHEN command is triggered and there is no active editor', async () => {
    const { given, when, then } = TestBuilder.build();
    given.anyConfiguration().and.theUserHaveNotOpenedAnyFileYet();

    await when.goToTestIsActioned();

    then.nothingIsDone();
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

  describe('Create Test File', () => {
    it('should create the test file when it does not exists', async () => {
      const expectedTestFilePath = '/src/module/sub-module/sub-sub-module/__tests__/my-file.js';
      const { given, when, then } = TestBuilder.build();
      given
        .theFollowingConfiguration(
          ConfigurationDouble.getInstance().withStrategy(StrategyOption.__TESTS__)
        )
        .and.theFile(expectedTestFilePath)
        .doesNotExists()
        .and.theUserOpens('/src/module/sub-module/sub-sub-module/my-file.js');

      await when.goToTestIsActioned();

      then.theTestFile(expectedTestFilePath).isCreated().and.isOpened();
    });

    it('should NOT create a test file when it does exists', async () => {
      const expectedTestFilePath = '/src/module/sub-module/sub-sub-module/__tests__/my-file.js';
      const { given, when, then } = TestBuilder.build();
      given
        .theFollowingConfiguration(
          ConfigurationDouble.getInstance().withStrategy(StrategyOption.__TESTS__)
        )
        .and.theUserOpens('/src/module/sub-module/sub-sub-module/my-file.js');

      await when.goToTestIsActioned();

      then.theTestFile(expectedTestFilePath).isNotCreated().and.isOpened();
    });
  });
});
