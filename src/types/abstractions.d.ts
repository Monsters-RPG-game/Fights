export interface IAbstractSubController<T> {
  execute(...params: unknown[]): Promise<T>;
}
