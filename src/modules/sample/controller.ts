import SampleRepository from './repository/index.js';
import * as enums from '../../enums/index.js';
import GetController from './subModules/get/index.js';
import AbstractController from '../../tools/abstractions/controller.js';

export default class SampleController extends AbstractController<enums.EControllers.Sample> {
  /**
   * Register sample controllers.
   * @returns Void.
   */
  protected init(): void {
    const sampleRepo = SampleRepository.createInstance();

    this.register(enums.ESampleActions.Get, new GetController(sampleRepo));
  }
}
