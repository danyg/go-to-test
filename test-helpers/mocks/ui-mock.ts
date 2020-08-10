/* eslint-disable @typescript-eslint/no-unused-vars */
import UserInterface from '../../src/interfaces/user-interface';
import { mock } from 'ts-mockito';

class UIDouble implements UserInterface {
  alertUserOfWrongStrategyOnConfiguration(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  info(message: string): void {
    throw new Error('Method not implemented.');
  }
}

export default mock(UIDouble);
