import Strategy from '../interfaces/strategy';
import Configuration from '../interfaces/configuration';

export default class CustomStrategy implements Strategy {
  public static getInstance(config: Configuration) {
    return new CustomStrategy(config);
  }

  private constructor(private config: Configuration) {}

  resolve(filePath: string): string {
    const regexp = new RegExp(this.config.match);
    return filePath.replace(regexp, this.config.replace);
  }
}
