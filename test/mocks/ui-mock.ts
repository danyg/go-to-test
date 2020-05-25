/* eslint-disable @typescript-eslint/no-unused-vars */
import UserInterface from '../../src/interfaces/user-interface';
import { mock } from 'ts-mockito';

class UIDouble implements UserInterface {
  info(message: string): void {
    throw new Error('Method not implemented.');
  }
}

export default mock(UIDouble);
