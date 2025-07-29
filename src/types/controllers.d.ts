import type * as enums from '../enums/index.js';
import type SampleController from '../modules/sample/controller.js';
import type GetSampleSubController from '../modules/sample/subModules/get/index.js';

export type IControllerActions = enums.ESampleActions;

type IControllerActionsMap = {
  [K in IControllerActions]: unknown;
};

export interface ISampleControllers extends IControllerActionsMap {
  [enums.ESampleActions.Get]: GetSampleSubController;
}

export interface IController {
  [enums.EControllers.Sample]: SampleController;
}

export interface IInnerController {
  [enums.EControllers.Sample]: ISampleControllers;
}
