import { EmptyPathTemplate } from 'exceptions/empty-path-template';
import { InvalidPathTemplate } from 'exceptions/invalid-path-template';

const dirSeparator = '[\\\\/]';
const variableMatcher = /(\$<\w+>)/g;
const regExpGroupMatcher = /\([^\)]+\)/g;

const patternsToRegExp = new Map<RegExp, string>();
patternsToRegExp.set(/[\\\/]/g, `(${dirSeparator})`);
patternsToRegExp.set(/\$<directory>/g, `([^\\\/]+)(${dirSeparator})`);
patternsToRegExp.set(/\$<moduleInternalPath>/g, `(.+)(${dirSeparator})`);
patternsToRegExp.set(/\$<filename>/, '([\\w\\s\\.-]+)');
patternsToRegExp.set(/\$<ext>/, '\\.([\\w\\s-]+)$');

type PathTemplate = string;
type PartialPathRegExp = string;

const getPronounIsAre = (elementsLength: number) => (elementsLength > 1 ? 'are' : 'is');

export class PathPatternsConverter {
  public static getInstance() {
    return new PathPatternsConverter();
  }

  private constructor() {}

  public toRegExp(pathTemplate: PathTemplate): RegExp {
    this.throwWhenEmptyTemplate(pathTemplate);

    return this.applyPatterns(pathTemplate);
  }

  public toReplacePattern(pathTemplate: PathTemplate) {
    this.throwWhenEmptyTemplate(pathTemplate);
    let partialPathTemplate = this.toPartialPathRegExp(pathTemplate);

    let counter = 0;
    partialPathTemplate = partialPathTemplate.replace(regExpGroupMatcher, () => `$${++counter}`);

    partialPathTemplate = this.sanitizeRegExpSpecialChars(partialPathTemplate);
    return partialPathTemplate;
  }

  private sanitizeRegExpSpecialChars(partialTransformedPathTemplate: string): string {
    return partialTransformedPathTemplate.replace('\\.', '.').replace(/\$$/, '');
  }

  private throwWhenEmptyTemplate(pathTemplate: string) {
    if (pathTemplate === '') {
      throw new EmptyPathTemplate('Given path template is empty');
    }
  }

  private applyPatterns(pathTemplate: PathTemplate): RegExp {
    const partialTransformedPathTemplate = this.toPartialPathRegExp(pathTemplate);

    this.throwWhenInvalidPatterns(partialTransformedPathTemplate);

    return new RegExp(partialTransformedPathTemplate);
  }

  private toPartialPathRegExp(pathTemplate: string): PartialPathRegExp {
    let partialTransformedPathTemplate: PartialPathRegExp = pathTemplate;
    patternsToRegExp.forEach((equivalentRegexp, pattern) => {
      partialTransformedPathTemplate = partialTransformedPathTemplate.replace(
        pattern,
        equivalentRegexp
      );
    });
    return partialTransformedPathTemplate;
  }

  private throwWhenInvalidPatterns(partialPathTemplate: PartialPathRegExp) {
    const matches = partialPathTemplate.match(variableMatcher);
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
      invalidPatterns = `${matchesArray.join(', ')} and ${last}`;
    } else {
      invalidPatterns = matchesArray.toString();
    }
    return invalidPatterns;
  }
}
