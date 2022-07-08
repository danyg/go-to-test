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

      expect(actualRegExp.toString()).toEqual('/([^\\/]+)[\\/]/');
    });

    it('should transform the pattern $<directory>$<directory>', () => {
      const actualRegExp = pathPatternsConverter.toRegExp('$<directory>$<directory>');

      expect(actualRegExp.toString()).toEqual('/([^\\/]+)[\\/]([^\\/]+)[\\/]/');
    });

    it('should transform the pattern $<moduleInternalPath>', () => {
      const actualRegExp = pathPatternsConverter.toRegExp('$<moduleInternalPath>');

      expect(actualRegExp.toString()).toEqual('/(.+)[\\/]/');
    });

    it('should transform the pattern $<moduleInternalPath>tests$<moduleInternalPath>', () => {
      const actualRegExp = pathPatternsConverter.toRegExp(
        '$<moduleInternalPath>tests$<moduleInternalPath>'
      );

      expect(actualRegExp.toString()).toEqual('/(.+)[\\/]tests(.+)[\\/]/');
    });

    it('should transform the pattern $<ext>', () => {
      const actualRegExp = pathPatternsConverter.toRegExp('$<ext>');

      expect(actualRegExp.toString()).toEqual('/.([w]+)$/');
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
});
