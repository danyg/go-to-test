import * as expect from 'expect';

class Then {
  private expectAccessor = { expect };

  I() {
    return this.expectAccessor;
  }

  isExpected = expect;
}

export const then = () => new Then();
