import Strategy from '../interfaces/strategy';

export default class MavenStrategy implements Strategy {
  public static getInstance() {
    return new MavenStrategy();
  }

  resolve(filePath: string): string {
    return filePath.replace(
      /^(?<projectPath>.*)src\/main(?<moduleInternalPath>.*)\.(?<ext>[^\.]+)$/,
      '$<projectPath>src/test$<moduleInternalPath>Test.$<ext>'
    );
  }
}
