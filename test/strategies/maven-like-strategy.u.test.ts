import { StrategyOption } from 'interfaces/configuration';

import { ConfigurationDouble } from 'test-helpers/mocks/configuration-double';
import { TestBuilder } from 'test-helpers/TestBuilder';

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
