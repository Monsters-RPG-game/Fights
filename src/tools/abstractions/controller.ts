import type * as enums from '../../enums/index.js';
import type * as types from '../../types/index.js';

export default abstract class AbstractController<T extends enums.EControllers> {
  private readonly _controllers: Map<
    types.IControllerActions,
    types.IInnerController[T][keyof types.IInnerController[T]]
  > = new Map<types.IControllerActions, types.IInnerController[T][keyof types.IInnerController[T]]>();

  constructor() {
    this.init();
  }

  private get controllers(): Map<types.IControllerActions, types.IInnerController[T][keyof types.IInnerController[T]]> {
    return this._controllers;
  }

  /**
   * Register new controller.
   * @param target Target to register.
   * @param value Initialized controller.
   */
  register<N extends keyof types.IInnerController[T]>(target: N, value: types.IInnerController[T][N]): void {
    this.controllers.set(target as types.IControllerActions, value);
  }

  /**
   * Resolve new controller.
   * @param target Registered target.
   * @returns Registered target.
   */
  resolve<N extends keyof types.IInnerController[T]>(target: N): types.IInnerController[T][N] | undefined {
    return this.controllers.get(target as types.IControllerActions) as types.IInnerController[T][N] | undefined;
  }

  protected abstract init(): void;
}
