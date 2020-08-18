import { promises as fsPromises } from 'fs';
import * as glob from 'glob';
import { testWorkspace } from '../../test-paths';

export default class FileSystemForTests {
  public static getInstance() {
    return new FileSystemForTests();
  }

  public async doesNotHave(filePath: string) {
    try {
      await fsPromises.unlink(filePath);
    } catch (e) {}
  }

  public async getListOfFS(): Promise<string[]> {
    return new Promise((resolve, reject) =>
      glob(
        '**/*',
        {
          cwd: testWorkspace
        },
        (err, matches) => {
          err ? reject(err) : resolve(matches);
        }
      )
    );
  }
}
