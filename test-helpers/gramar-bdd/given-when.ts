import User from './actors/user';
import VSCode from './actors/vscode';

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
}

export const given = () => Lexic.getInstance();
export const when = () => Lexic.getInstance();
