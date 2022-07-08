import * as expect from 'expect';

import { PathPatternsConverter } from 'core/path-patterns-converter';
import { EmptyPathTemplate } from 'exceptions/empty-path-template';
import { InvalidPathTemplate } from 'exceptions/invalid-path-template';

describe('PathPatternsConverter', () => {
  let pathPatternsConverter: PathPatternsConverter;
  beforeEach(() => {
    pathPatternsConverter = PathPatternsConverter.getInstance();
  });

  describe('toRegExp', () => {
    it('thrown an error when given template is empty', () => {
      const toThrow = () => pathPatternsConverter.toRegExp('');

      expect(toThrow).toThrowError(new EmptyPathTemplate('Given path template is empty'));
    });

    it('should transform the pattern $<directory>', () => {
      const actualRegExp = pathPatternsConverter.toRegExp('$<directory>');

      expect(actualRegExp).toEqual(/([^\/]+)[\/]/);
    });

    it('should transform the pattern $<directory>$<directory>', () => {
      const actualRegExp = pathPatternsConverter.toRegExp('$<directory>$<directory>');

      expect(actualRegExp).toEqual(/([^\/]+)[\/]([^\/]+)[\/]/);
    });

    it('should transform the pattern $<moduleInternalPath>', () => {
      const actualRegExp = pathPatternsConverter.toRegExp('$<moduleInternalPath>');

      expect(actualRegExp).toEqual(/(.+)[\/]/);
    });

    it('should transform the pattern $<moduleInternalPath>tests$<moduleInternalPath>', () => {
      const actualRegExp = pathPatternsConverter.toRegExp(
        '$<moduleInternalPath>tests$<moduleInternalPath>'
      );

      expect(actualRegExp).toEqual(/(.+)[\/]tests(.+)[\/]/);
    });

    it('should transform the pattern $<filename>', () => {
      const actualRegExp = pathPatternsConverter.toRegExp('$<filename>');

      expect(actualRegExp).toEqual(/([\w\d\s\._-]+)/);
    });

    it('should transform the pattern $<ext>', () => {
      const actualRegExp = pathPatternsConverter.toRegExp('$<ext>');

      expect(actualRegExp).toEqual(/\.([\w]+)$/);
    });

    it('should transform the pattern $<directory>$<directory>$<moduleInternalPath>$<filename>$<ext>', () => {
      const actualRegExp = pathPatternsConverter.toRegExp(
        '$<directory>$<directory>$<moduleInternalPath>$<filename>$<ext>'
      );

      expect(actualRegExp).toEqual(/([^\/]+)[\/]([^\/]+)[\/](.+)[\/]([\w\d\s\._-]+)\.([\w]+)$/);
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
  });

  describe('toReplacePattern', () => {
    it('thrown an error when given template is empty', () => {
      const toThrow = () => pathPatternsConverter.toReplacePattern('');

      expect(toThrow).toThrowError(new EmptyPathTemplate('Given path template is empty'));
    });

    it('should handle `$<directory>` pattern', () => {
      const replacePattern = pathPatternsConverter.toReplacePattern('$<directory>');

      expect(replacePattern).toBe('$1/');
    });

    it('should handle `$<directory>$<directory>` pattern', () => {
      const replacePattern = pathPatternsConverter.toReplacePattern('$<directory>$<directory>');

      expect(replacePattern).toBe('$1/$2/');
    });

    it('should handle `$<directory>$<directory>$<moduleInternalPath>` pattern', () => {
      const replacePattern = pathPatternsConverter.toReplacePattern(
        '$<directory>$<directory>$<moduleInternalPath>'
      );

      expect(replacePattern).toBe('$1/$2/$3/');
    });

    it('should handle `$<directory>$<directory>$<moduleInternalPath>$<filename>$<ext>` pattern', () => {
      const replacePattern = pathPatternsConverter.toReplacePattern(
        '$<directory>$<directory>$<moduleInternalPath>$<filename>$<ext>'
      );

      expect(replacePattern).toBe('$1/$2/$3/$4.$5');
    });
  });
});
