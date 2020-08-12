export default interface UserInterface {
  info(message: string): void;
  alertUserOfError(error: Error): Promise<void>;
}
