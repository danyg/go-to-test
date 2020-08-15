import UserInterface from '../../src/interfaces/user-interface';
import { mock } from 'ts-mockito';

class UIDouble implements UserInterface {
  alertUserOfError(error: Error): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

export default mock(UIDouble);
