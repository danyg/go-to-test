import Strategy from '../interfaces/strategy';

export default class UUTestsUUStrategy implements Strategy {
  public static getInstance() {
    return new UUTestsUUStrategy();
  }

  resolve(filePath: string): string {
    return filePath.replace(
      /^(?<containerPath>.*)\/(?<fileName>[^\/]+)\.(?<ext>[^\.]+)$/,
      '$<containerPath>/__tests__/$<fileName>.$<ext>'
    );
  }
}
