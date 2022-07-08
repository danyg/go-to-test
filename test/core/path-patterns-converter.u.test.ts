import * as expect from 'expect';

import { PathPatternsConverter } from 'core/path-patterns-converter';
import { EmptyPathTemplate } from 'exceptions/empty-path-template';
import { InvalidPathTemplate } from 'exceptions/invalid-path-template';

describe('PathPatternsConverter', () => {
  let pathPatternsConverter: PathPatternsConverter;
  beforeEach(() => {
    pathPatternsConverter = PathPatternsConverter.getInstance();
  });

  describe('Integration', () => {
    it('should allow path conversions', () => {
      // GIVEN
      const srcFilePath =
        '/home/user/Workspace/myMonoRepo/myApp/src/ComponentName/SubComponentName/SubSubComponentName/SubSubComponentName.tsx';
      const testFilePath =
        '/home/user/Workspace/myMonoRepo/myApp/tests/ComponentName/SubComponentName/SubSubComponentName/SubSubComponentName.UnitTest.tsx';
      const srcPattern = '$<directory>src/$<moduleInternalPath>$<filename>$<ext>';
      const testPattern = '$<directory>tests/$<moduleInternalPath>$<filename>.UnitTest$<ext>';

      const srcMatch = pathPatternsConverter.toRegExp(srcPattern);
      const srcReplace = pathPatternsConverter.toReplacePattern(srcPattern);
      const testMatch = pathPatternsConverter.toRegExp(testPattern);
      const testReplace = pathPatternsConverter.toReplacePattern(testPattern);

      // WHEN
      const calcSrcFilePath = testFilePath.replace(testMatch, srcReplace);
      const calcTestFilePath = srcFilePath.replace(srcMatch, testReplace);

      // THEN
      expect(calcSrcFilePath).toEqual(srcFilePath);
      expect(calcTestFilePath).toEqual(testFilePath);
    });

    it('should work with Windows Directory separator', () => {
      // GIVEN
      const srcFilePath =
        'C:\\myApp\\src\\ComponentName\\SubComponentName\\SubSubComponentName\\SubSubComponentName.tsx';
      const testFilePath =
        'C:\\myApp\\tests\\ComponentName\\SubComponentName\\SubSubComponentName\\SubSubComponentName.UnitTest.tsx';
      const srcPattern = '$<directory>src\\$<moduleInternalPath>$<filename>$<ext>';
      const testPattern = '$<directory>tests\\$<moduleInternalPath>$<filename>.UnitTest$<ext>';

      const srcMatch = pathPatternsConverter.toRegExp(srcPattern);
      const srcReplace = pathPatternsConverter.toReplacePattern(srcPattern);
      const testMatch = pathPatternsConverter.toRegExp(testPattern);
      const testReplace = pathPatternsConverter.toReplacePattern(testPattern);

      console.log('srcMatch   : ', srcMatch);
      console.log('srcReplace : ', srcReplace);
      console.log('testMatch  : ', testMatch);
      console.log('testReplace: ', testReplace);

      // WHEN
      const calcSrcFilePath = testFilePath.replace(testMatch, srcReplace);
      const calcTestFilePath = srcFilePath.replace(srcMatch, testReplace);

      // THEN
      expect(calcSrcFilePath).toEqual(srcFilePath);
      expect(calcTestFilePath).toEqual(testFilePath);
    });
  });

  describe('toRegExp', () => {
    it('thrown an error when given template is empty', () => {
      const toThrow = () => pathPatternsConverter.toRegExp('');

      expect(toThrow).toThrowError(new EmptyPathTemplate('Given path template is empty'));
    });

    it('the pattern $<directory> should match one directory', () => {
      const actualRegExp = pathPatternsConverter.toRegExp('$<directory>');

      const matchIndirect = 'directory1/directory2'.replace(actualRegExp, '[MATCHED]');

      expect(matchIndirect).toEqual('[MATCHED]directory2');
    });

    it('the pattern $<directory> should match one directory [windows]', () => {
      const actualRegExp = pathPatternsConverter.toRegExp('$<directory>');

      const matchIndirect = 'directory1\\directory2'.replace(actualRegExp, '[MATCHED]');

      expect(matchIndirect).toEqual('[MATCHED]directory2');
    });

    it('the pattern $<directory>$<directory> should match 2 consecutive directories', () => {
      const actualRegExp = pathPatternsConverter.toRegExp('$<directory>$<directory>');

      const matchIndirect = 'directory1/directory2/directory3'.replace(actualRegExp, '[MATCHED]');

      expect(matchIndirect).toEqual('[MATCHED]directory3');
    });

    it('the pattern $<directory>$<directory> should match 2 consecutive directories [windows]', () => {
      const actualRegExp = pathPatternsConverter.toRegExp('$<directory>$<directory>');

      const matchIndirect = 'directory1\\directory2\\directory3'.replace(actualRegExp, '[MATCHED]');

      expect(matchIndirect).toEqual('[MATCHED]directory3');
    });

    it('the pattern $<moduleInternalPath> should match several directories', () => {
      const actualRegExp = pathPatternsConverter.toRegExp('src/$<moduleInternalPath>myfile.js');

      const filePaths = [
        'src/directory1/myfile.js',
        'src/directory1/directory2/myfile.js',
        'src/directory1/directory2/directory3/myfile.js',
        'src/directory 1/myfile.js',
        'src/.-+=()*&^%$#@!~`/directory 1/myfile.js',
        'src/directory 1/[directory] - 😀 happiness/myfile.js',
        'src/is/🐱/🐱/🐱/🐱/🐱/🐱/🐱/myfile.js'
      ];

      filePaths.forEach((filePath) => {
        const matchIndirect = filePath.replace(actualRegExp, '[MATCHED]');

        expect(matchIndirect).toEqual('[MATCHED]');
      });
    });

    it('the pattern $<moduleInternalPath> should match several directories [windows]', () => {
      const actualRegExp = pathPatternsConverter.toRegExp('src/$<moduleInternalPath>myfile.js');

      const filePaths = [
        'C:\\src\\directory1\\myfile.js',
        'C:\\src\\directory1\\directory2\\myfile.js',
        'C:\\src\\directory1\\directory2\\directory3\\myfile.js',
        'C:\\src\\directory 1\\myfile.js',
        'C:\\src\\.-+=()*&^%$#@!~`\\directory 1\\myfile.js',
        'C:\\src\\directory 1\\[directory] - 😀 happiness\\myfile.js',
        'C:\\src\\is\\🐱\\🐱\\🐱\\🐱\\🐱\\🐱\\🐱\\myfile.js'
      ];

      filePaths.forEach((filePath) => {
        const matchIndirect = filePath.replace(actualRegExp, '[MATCHED]');

        expect(matchIndirect).toEqual('C:\\[MATCHED]');
      });
    });

    it('should allow to transform the pattern $<moduleInternalPath>tests$<moduleInternalPath>', () => {
      const actualRegExp = pathPatternsConverter.toRegExp(
        '$<moduleInternalPath>tests$<moduleInternalPath>myfile.js'
      );
      const filePath = 'Component/SubComponent/tests/testHelpers/theTestHelperModule/lib/myfile.js';

      const matchIndirect = filePath.replace(actualRegExp, '[MATCHED]');

      expect(matchIndirect).toEqual('[MATCHED]');
    });

    it('should allow to transform the pattern $<moduleInternalPath>tests$<moduleInternalPath> [windows]', () => {
      const actualRegExp = pathPatternsConverter.toRegExp(
        '$<moduleInternalPath>tests$<moduleInternalPath>myfile.js'
      );
      const filePath =
        'Component\\SubComponent\\tests\\testHelpers\\theTestHelperModule\\lib\\myfile.js';

      const matchIndirect = filePath.replace(actualRegExp, '[MATCHED]');

      expect(matchIndirect).toEqual('[MATCHED]');
    });

    it('should transform the pattern $<filename>', () => {
      const actualRegExp = pathPatternsConverter.toRegExp('$<filename>');

      const filePaths = [
        'myfile.js',
        'myfile33.js',
        'myfile.33.js',
        'myfile-dashed-a-lot.js',
        'myfile-dashed-a-lot-123-56-2.js',
        'myfile spaced a lot.js',
        'myfile spaced a lot 123 56 2.js',
        'myfile_underscored_a_lot.js',
        'myfile_underscored_a_lot_123_56_2.js'
      ];

      filePaths.forEach((filePath) => {
        const matchIndirect = filePath.replace(actualRegExp, '[MATCHED]');

        expect(matchIndirect).toEqual('[MATCHED]');
      });
    });

    it('should transform the pattern $<ext>', () => {
      const actualRegExp = pathPatternsConverter.toRegExp('$<ext>');

      const fileNames = ['myfile', 'myfile.33', 'myfile.test', 'myfile.u.test'];
      const extensions = [
        '.js',
        '.ts',
        '.tsx',
        '.jsx',
        '.py',
        '.aFileExtension',
        '.a33extension',
        '.a_file_extension_42',
        '.a-file-extension-42',
        '.a file extension 42'
      ];

      fileNames.forEach((filename) => {
        extensions.forEach((extension) => {
          const matchIndirect = `${filename}${extension}`.replace(actualRegExp, '[MATCHED]');

          expect(matchIndirect).toEqual(`${filename}[MATCHED]`);
        });
      });
    });

    it('should transform the pattern $<directory>$<directory>$<moduleInternalPath>$<filename>$<ext>', () => {
      // GIVEN
      const useIt = (regExp: RegExp) => {
        const filePath =
          'Component/tests/SubComponent/testHelpers/theTestHelperModule/lib/myfile.js';
        const badFilePath =
          'Component/test/SubComponent/testHelpers/theTestHelperModule/lib/myfile.js';
        return {
          matchIndirect: filePath.replace(regExp, '[MATCHED]'),
          matchIndirectBad: badFilePath.replace(regExp, '[MATCHED]'),
          badFilePath
        };
      };

      // WHEN
      const actualRegExp = pathPatternsConverter.toRegExp(
        '$<directory>tests$<moduleInternalPath>$<filename>$<ext>'
      );
      const { matchIndirect, matchIndirectBad, badFilePath } = useIt(actualRegExp);

      // THEN
      expect(matchIndirect).toEqual('[MATCHED]');
      expect(matchIndirectBad).toEqual(badFilePath);
    });

    it('should transform the pattern $<directory>$<directory>$<moduleInternalPath>$<filename>$<ext> [windows]', () => {
      // GIVEN
      const useIt = (regExp: RegExp) => {
        const filePath =
          'Component\\tests\\SubComponent\\testHelpers\\theTestHelperModule\\lib\\myfile.js';

        return filePath.replace(regExp, '[MATCHED]');
      };

      // WHEN
      const actualRegExp = pathPatternsConverter.toRegExp(
        '$<directory>tests$<moduleInternalPath>$<filename>$<ext>'
      );
      const matchIndirect = useIt(actualRegExp);

      // THEN
      expect(matchIndirect).toEqual('[MATCHED]');
    });

    it('should transform `/` to safe directory separator matcher', () => {
      // GIVEN
      const useIt = (regExp: RegExp) => {
        const posixFilePath = '/home/user/workspace/app/src/something';
        const windowsFilePath = 'C:\\Users\\user\\My Documents\\app\\src\\something';
        return {
          posixReplaced: posixFilePath.replace(regExp, '[MATCHED]'),
          windowsReplaced: windowsFilePath.replace(regExp, '[MATCHED]')
        };
      };

      // WHEN
      const actualRegExp = pathPatternsConverter.toRegExp('/app/src/something');
      const { posixReplaced, windowsReplaced } = useIt(actualRegExp);

      // THEN
      expect(posixReplaced).toEqual('/home/user/workspace[MATCHED]');
      expect(windowsReplaced).toEqual('C:\\Users\\user\\My Documents[MATCHED]');
    });

    it('should transform `\\` to safe directory separator matcher', () => {
      // GIVEN
      const useIt = (regExp: RegExp) => {
        const posixFilePath = '/home/user/workspace/app/src/something';
        const windowsFilePath = 'C:\\Users\\user\\My Documents\\app\\src\\something';
        return {
          posixReplaced: posixFilePath.replace(regExp, '[MATCHED]'),
          windowsReplaced: windowsFilePath.replace(regExp, '[MATCHED]')
        };
      };

      // WHEN
      const actualRegExp = pathPatternsConverter.toRegExp('\\app\\src\\something');
      const { posixReplaced, windowsReplaced } = useIt(actualRegExp);

      // THEN
      expect(posixReplaced).toEqual('/home/user/workspace[MATCHED]');
      expect(windowsReplaced).toEqual('C:\\Users\\user\\My Documents[MATCHED]');
    });

    it('should error when there are more than one $<ext> patterns', () => {
      const toThrow = () => pathPatternsConverter.toRegExp('$<ext>$<ext>');

      expect(toThrow).toThrowError(
        new InvalidPathTemplate(
          'Given path template is invalid: $<ext> is not valid or only be present once'
        )
      );
    });

    it('should error when there are non valid patterns', () => {
      const toThrow = () => pathPatternsConverter.toRegExp('$<Invalid>$<ext>$<ext>');

      expect(toThrow).toThrowError(
        new InvalidPathTemplate(
          'Given path template is invalid: $<Invalid> and $<ext> are not valid or only be present once'
        )
      );
    });

    it('should error when there are more than 2 non valid patterns', () => {
      const toThrow = () => pathPatternsConverter.toRegExp('$<Invalid>$<Invalid>$<ext>$<ext>');

      expect(toThrow).toThrowError(
        new InvalidPathTemplate(
          'Given path template is invalid: $<Invalid>, $<Invalid> and $<ext> are not valid or only be present once'
        )
      );
    });
  });

  describe('toReplacePattern', () => {
    it('should error when given template is empty', () => {
      const toThrow = () => pathPatternsConverter.toReplacePattern('');

      expect(toThrow).toThrowError(new EmptyPathTemplate('Given path template is empty'));
    });

    it('should handle `$<directory>` pattern', () => {
      const replacePattern = pathPatternsConverter.toReplacePattern('$<directory>');

      expect(replacePattern).toBe('$1$2');
    });

    it('should handle `$<directory>$<directory>` pattern', () => {
      const replacePattern = pathPatternsConverter.toReplacePattern('$<directory>$<directory>');

      expect(replacePattern).toBe('$1$2$3$4');
    });

    it('should handle `$<directory>$<directory>$<moduleInternalPath>` pattern', () => {
      const replacePattern = pathPatternsConverter.toReplacePattern(
        '$<directory>$<directory>$<moduleInternalPath>'
      );

      expect(replacePattern).toBe('$1$2$3$4$5$6');
    });

    it('should handle `$<directory>$<directory>$<moduleInternalPath>$<filename>$<ext>` pattern', () => {
      const replacePattern = pathPatternsConverter.toReplacePattern(
        '$<directory>$<directory>$<moduleInternalPath>$<filename>$<ext>'
      );

      expect(replacePattern).toBe('$1$2$3$4$5$6$7.$8');
    });

    it('should translate all / and \\ to replacers', () => {
      const replacePatternPosix = pathPatternsConverter.toReplacePattern('my/path/yeah');
      const replacePatternWindows = pathPatternsConverter.toReplacePattern('my\\path\\yeah');

      expect(replacePatternPosix).toBe('my$1path$2yeah');
      expect(replacePatternWindows).toBe('my$1path$2yeah');
    });
  });
});
