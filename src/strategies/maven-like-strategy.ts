import Strategy from 'interfaces/strategy';

export default class MavenLikeStrategy implements Strategy {
  public static getInstance() {
    return new MavenLikeStrategy();
  }

  resolve(filePath: string): string {
    return filePath.replace(
      /^(?<projectPath>.*)src(?<moduleInternalPath>.*)\.(?<ext>[^\.]+)$/,
      '$<projectPath>test$<moduleInternalPath>.test.$<ext>'
    );
  }
}
