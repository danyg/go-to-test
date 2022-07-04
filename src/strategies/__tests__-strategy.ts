import Strategy from 'interfaces/strategy';

export default class UUTestsUUStrategy implements Strategy {
  public static getInstance() {
    return new UUTestsUUStrategy();
  }

  resolve(filePath: string): string {
    return filePath.replace(
      /^(?<containerPath>.*)(?<dirSep>[\\\/])(?<fileName>[^\/]+)\.(?<ext>[^\.]+)$/,
      '$<containerPath>$<dirSep>__tests__$<dirSep>$<fileName>.$<ext>'
    );
  }
}
