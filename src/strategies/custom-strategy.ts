import Strategy from '../interfaces/strategy';
import Configuration from '../interfaces/configuration';
import { StrategyResolveError } from '../exceptions/strategy-resolve-error';

export default class CustomStrategy implements Strategy {
  public static getInstance(config: Configuration) {
    return new CustomStrategy(config);
  }

  private constructor(private config: Configuration) {}

  resolve(filePath: string): string {
    const regexp = new RegExp(this.config.match); // TODO Cache regexp object

    if (null === filePath.match(regexp)) {
      throw new StrategyResolveError(
        `Could not match RegExp: "${this.config.match}" With file path: "${filePath}". Please ensure settings.json "go-to-test.match" is a valid RegExp and will match as expected.`
      );
    }

    return filePath.replace(regexp, this.config.replace);
  }
}
