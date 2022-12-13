import Strategy from 'interfaces/strategy';

const sourcePattern = /^(?<containerPath>.*)(?<dirSep>[\\\/])(?<fileName>[^\/]+)\.(?<ext>[^\.]+)$/;
const testPattern = /^(?<containerPath>.*)(?<dirSep>[\\\/])__tests__[\\\/](?<fileName>[^\/]+)\.(?<ext>[^\.]+)$/;

const testTemplate = '$<containerPath>$<dirSep>__tests__$<dirSep>$<fileName>.$<ext>';
const sourceTemplate = '$<containerPath>$<dirSep>$<fileName>.$<ext>';

export default class UUTestsUUStrategy implements Strategy {
  public static getInstance() {
    return new UUTestsUUStrategy();
  }

  resolve(filePath: string): string {
    if (filePath.match(testPattern)) {
      return filePath.replace(testPattern, sourceTemplate);
    }
    return filePath.replace(sourcePattern, testTemplate);
  }
}
