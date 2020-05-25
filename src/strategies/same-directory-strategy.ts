import Strategy from '../interfaces/strategy';

export default class SameDirectoryStrategy implements Strategy {
  public static getInstance() {
    return new SameDirectoryStrategy();
  }

  resolve(filePath: string): string {
    return filePath.replace(/^(?<filePath>.*)\.(?<ext>[^\.]+)$/, '$<filePath>.test.$<ext>');
  }
}
