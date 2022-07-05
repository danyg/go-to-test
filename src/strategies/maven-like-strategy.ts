import Strategy from 'interfaces/strategy';

const sourcePattern = /^(?<projectPath>.*)src(?<moduleInternalPath>.*)\.(?<ext>[^\.]+)$/;
const testPattern = /^(?<projectPath>.*)test(?<moduleInternalPath>.*)\.test\.(?<ext>[^\.]+)$/;

const sourceTemplate = '$<projectPath>src$<moduleInternalPath>.$<ext>';
const testTemplate = '$<projectPath>test$<moduleInternalPath>.test.$<ext>';

export default class MavenLikeStrategy implements Strategy {
  public static getInstance() {
    return new MavenLikeStrategy();
  }

  resolve(filePath: string): string {
    if (filePath.match(testPattern)) {
      return filePath.replace(testPattern, sourceTemplate);
    }
    return filePath.replace(sourcePattern, testTemplate);
  }
}
