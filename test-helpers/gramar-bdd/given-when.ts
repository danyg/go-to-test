import User from './actors/user';
import VSCode from './actors/vscode';
import FileSystemForTests from './actors/file-system-for-tests';

class Lexic {
  public static getInstance() {
    return new Lexic();
  }

  private constructor() {}

  public user() {
    return User.getInstance();
  }

  public vscode() {
    return VSCode.getInstance();
  }

  public fileSystem() {
    return FileSystemForTests.getInstance();
  }
}

export const given = () => Lexic.getInstance();
export const when = () => Lexic.getInstance();
