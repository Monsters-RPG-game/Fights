import getController from './utils.js';
import * as enums from '../../../enums/index.js';
import GetSampleDto from '../../../modules/sample/subModules/get/dto.js';
import State from '../../../tools/state.js';
import type { IGetSampleDto } from '../../../modules/sample/subModules/get/types.js';
import type { IUserBrokerInfo } from '../../../types/user.js';

export default class SampleService {
  async get(payload: unknown, user: IUserBrokerInfo): Promise<void> {
    const action = getController(enums.EControllers.Sample, enums.ESampleActions.Get);

    const callBack = await action.execute(new GetSampleDto(payload as IGetSampleDto));
    return State.broker.send(user.tempId, callBack, enums.EMessageTypes.Send);
  }
}
