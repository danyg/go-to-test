/* eslint-disable @typescript-eslint/no-unused-vars */
import UserInterface from '../../src/interfaces/user-interface';
import { mock } from 'ts-mockito';
import { StrategyResolveError } from '../../src/exceptions/strategy-resolve-error';

class UIDouble implements UserInterface {
  alertUserOfError(error: Error): Promise<void> {
    throw new Error('Method not implemented.');
  }

  info(message: string): void {
    throw new Error('Method not implemented.');
  }
}

export default mock(UIDouble);
