export default interface Strategy {
  resolve(filePath: string): string;
}
