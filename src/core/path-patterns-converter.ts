import { EmptyPathTemplate } from 'exceptions/empty-path-template';
import { InvalidPathTemplate } from 'exceptions/invalid-path-template';

const patternsToRegExp = new Map<RegExp, string>();
patternsToRegExp.set(/\$<directory>/g, '([^\\/]+)[\\/]');
patternsToRegExp.set(/\$<moduleInternalPath>/g, '(.+)[\\/]');
patternsToRegExp.set(/\$<ext>/, '.([w]+)$');
const patternMatcher = /(\$<\w+>)/g;

type PathTemplate = string;
type PartialTransformedPathTemplate = string;

const getPronounIsAre = (elementsLength: number) => (elementsLength > 1 ? 'are' : 'is');

export class PathPatternsConverter {
  public static getInstance() {
    return new PathPatternsConverter();
  }

  private constructor() {}

  public toRegExp(pathTemplate: PathTemplate): RegExp {
    if (pathTemplate === '') {
      throw new EmptyPathTemplate('Given path template is empty');
    }
    return this.applyPatterns(pathTemplate);
  }

  private applyPatterns(pathTemplate: PathTemplate): RegExp {
    let transformedPathTemplate: PartialTransformedPathTemplate = pathTemplate;
    patternsToRegExp.forEach((equivalentRegexp, pattern) => {
      transformedPathTemplate = transformedPathTemplate.replace(pattern, equivalentRegexp);
    });

    this.throwWhenInvalidPatterns(transformedPathTemplate);

    return new RegExp(transformedPathTemplate);
  }

  private throwWhenInvalidPatterns(partialPathTemplate: PartialTransformedPathTemplate) {
    const matches = partialPathTemplate.match(patternMatcher);
    if (matches) {
      const message = this.getInvalidPathTemplateMessage(matches);
      throw new InvalidPathTemplate(message);
    }
  }

  private getInvalidPathTemplateMessage(matches: RegExpMatchArray) {
    const pronoun = getPronounIsAre(matches.length);
    const invalidPatterns = this.getInvalidPatterns(matches);
    return `Given path template is invalid: ${invalidPatterns} ${pronoun} not valid or only be present once`;
  }

  private getInvalidPatterns(matches: RegExpMatchArray) {
    const matchesArray = Array.from(matches);
    let invalidPatterns = '';
    if (matchesArray.length > 1) {
      const last = matchesArray.pop();
      invalidPatterns = `${matchesArray.join(',')} and ${last}`;
    } else {
      invalidPatterns = matchesArray.join(',');
    }
    return invalidPatterns;
  }
}
