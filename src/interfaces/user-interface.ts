export default interface UserInterface {
  alertUserOfError(error: Error): Promise<void>;
}
