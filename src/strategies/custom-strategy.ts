import Strategy from 'interfaces/strategy';
import Configuration from 'interfaces/configuration';
import { StrategyResolveError } from 'exceptions/strategy-resolve-error';

export default class CustomStrategy implements Strategy {
  public static getInstance(config: Configuration) {
    return new CustomStrategy(config);
  }

  private constructor(private config: Configuration) {}

  public resolve(filePath: string): string {
    const regexp = new RegExp(this.config.match); // TODO Cache regexp object
    const isPosix = filePath.includes('/');
    const posixFilePath = this.toPosix(filePath);

    if (null === posixFilePath.match(regexp)) {
      throw new StrategyResolveError(
        `Could not match RegExp: "${this.config.match}" With file path: "${posixFilePath}". Please ensure settings.json "go-to-test.match" is a valid RegExp and will match as expected.`
      );
    }

    const testPosixFilePath = posixFilePath.replace(regexp, this.config.replace);
    return isPosix ? testPosixFilePath : this.toWindows(testPosixFilePath);
  }

  private toPosix(filePath: string) {
    return filePath.replace(/\\/g, '/');
  }

  private toWindows(filePath: string) {
    return filePath.replace(/\//g, '\\');
  }
}
