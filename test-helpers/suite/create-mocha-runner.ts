import * as path from 'path';
import * as Mocha from 'mocha';
import * as glob from 'glob';

export function createMochaRunner(testsRoot: string, pattern: string) {
  return function run(): Promise<void> {
    // Create the mocha test
    const mocha = new Mocha({
      ui: 'bdd',
      color: true
    });

    return new Promise((c, e) => {
      glob(pattern, { cwd: testsRoot }, (err, files) => {
        if (err) {
          return e(err);
        }

        // Add files to the test suite
        files.forEach((f) => mocha.addFile(path.resolve(testsRoot, f)));

        try {
          // Run the mocha test
          mocha.run((failures) => {
            if (failures > 0) {
              e(new Error(`${failures} tests failed.`));
            } else {
              c();
            }
          });
        } catch (err) {
          console.error(err);
          e(err);
        }
      });
    });
  };
}
