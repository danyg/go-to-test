import { StrategyOption } from '../../src/interfaces/configuration';

import { ConfigurationDouble } from '../../test-helpers/mocks/configuration-double';
import { TestBuilder } from '../../test-helpers/TestBuilder';

describe('Maven Strategy', () => {
  it('should use maven strategy WHEN the configuration says so', async () => {
    const { given, when, then } = TestBuilder.build();
    given
      .theFollowingConfiguration(
        ConfigurationDouble.getInstance().withStrategy(StrategyOption.MAVEN)
      )
      .and.theUserOpens('/src/main/java/com/company/package1/MyClass.java');

    await when.goToTestIsActioned();

    then.theTestFile('/src/test/java/com/company/package1/MyClassTest.java').isOpened();
  });

  it('should use the nested `main` directory as projectPath', async () => {
    const { given, when, then } = TestBuilder.build();
    given
      .theFollowingConfiguration(
        ConfigurationDouble.getInstance().withStrategy(StrategyOption.MAVEN)
      )
      .and.theUserOpens(
        '/home/dev/src/main/theProject/src/main/java/com/company/package1/MyClass.java'
      );

    await when.goToTestIsActioned();

    then
      .theTestFile(
        '/home/dev/src/main/theProject/src/test/java/com/company/package1/MyClassTest.java'
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
