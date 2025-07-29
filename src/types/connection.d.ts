import type * as types from './index.js';
import type * as enums from '../enums/index.js';

export interface IRabbitMessage {
  user: types.IUserBrokerInfo;
  target: enums.EMessageTargets | enums.EMessageTypes;
  subTarget: enums.ESampleTargets;
  payload: unknown;
}
