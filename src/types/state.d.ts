import type Broker from '../connections/broker/index.js';
import type { IMongoInstance } from '../connections/mongo/types.js';
import type Bootstrap from '../tools/bootstrap.js';

export interface IState {
  mongo: IMongoInstance;
  broker: Broker;
  controllers: Bootstrap;
}
