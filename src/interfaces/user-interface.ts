export default interface UserInterface {
  info(message: string): void;
  alertUserOfWrongStrategyOnConfiguration(): Promise<void>;
}
