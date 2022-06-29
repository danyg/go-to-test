import { StrategyOption } from '../../src/interfaces/configuration';

import { ConfigurationDouble } from '../../test-helpers/mocks/configuration-double';
import { TestBuilder } from '../../test-helpers/TestBuilder';

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
