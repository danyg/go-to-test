export interface Disposable {
  dispose(): void;
}
export interface ExtensionContext {
  subscriptions: Disposable[];
}
