import * as services from './services/index.js';
import * as enums from '../../enums/index.js';
import * as errors from '../../errors/index.js';
import type * as types from '../../types/index.js';

export default class Handler {
  private readonly _sampleServices: services.SampleServices;

  constructor() {
    this._sampleServices = new services.SampleServices();
  }

  private get sampleServices(): services.SampleServices {
    return this._sampleServices;
  }

  async sampleMessage(message: types.IRabbitMessage): Promise<void> {
    switch (message.subTarget) {
      case enums.ESampleTargets.Get:
        return this.sampleServices.get(message.payload, message.user);
      default:
        throw new errors.IncorrectTargetError();
    }
  }
}
