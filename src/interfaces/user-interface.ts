import { StrategyResolveError } from '../exceptions/strategy-resolve-error';

export default interface UserInterface {
  info(message: string): void;
  alertUserOfError(error: StrategyResolveError): Promise<void>;
}
