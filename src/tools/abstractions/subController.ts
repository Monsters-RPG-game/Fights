import type { EControllers } from '../../enums/index.js';
import type { IController } from '../../types/index.js';

export default abstract class ControllerFactory<T extends EControllers> {
  private readonly _repository: IController[T];

  protected constructor(repository: IController[T]) {
    this._repository = repository;
  }

  protected get repository(): IController[T] {
    return this._repository;
  }
}
