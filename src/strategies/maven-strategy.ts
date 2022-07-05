import Strategy from 'interfaces/strategy';

const sourcePattern = /^(?<projectPath>.*)src(?<dirSep>[\\\/])main(?<moduleInternalPath>.*)\.(?<ext>[^\.]+)$/;
const testPattern = /^(?<projectPath>.*)src(?<dirSep>[\\\/])test(?<moduleInternalPath>.*)Test\.(?<ext>[^\.]+)$/;

const sourceTemplate = '$<projectPath>src$<dirSep>main$<moduleInternalPath>.$<ext>';
const testTemplate = '$<projectPath>src$<dirSep>test$<moduleInternalPath>Test.$<ext>';

export default class MavenStrategy implements Strategy {
  public static getInstance() {
    return new MavenStrategy();
  }

  resolve(filePath: string): string {
    if (filePath.match(testPattern)) {
      return filePath.replace(testPattern, sourceTemplate);
    }
    return filePath.replace(sourcePattern, testTemplate);
  }
}
