import * as errors from '../../../errors/index.js';
import State from '../../../tools/state.js';
import type * as enums from '../../../enums/index.js';
import type * as types from '../../../types/index.js';

const getController = <T extends enums.EControllers, N extends types.IControllerActions>(
  target: T,
  subTarget: N,
): types.IInnerController[T][N] => {
  const controller = State.controllers.resolve(target);
  if (!controller) throw new errors.UnregisteredControllerError(target);

  const subController = controller.resolve(subTarget) as unknown as types.IAbstractSubController<T>; // This requires unknown, due to only 1 controller existing at this time
  if (!subController) throw new errors.UnregisteredControllerError(subTarget);

  return subController as unknown as types.IInnerController[T][N]; // This requires unknown, due to only 1 controller existing at this time
};

export default getController;
