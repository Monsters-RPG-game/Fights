import Log from 'simpl-loggar';
import type Bootstrap from './bootstrap.js';
import type Broker from '../connections/broker/index.js';
import type { IMongoInstance } from '../connections/mongo/types.js';
import type { IState } from '../types/index.js';

class State implements IState {
  private _mongo: IMongoInstance | null = null;
  private _broker: Broker | null = null;
  private _controllers: Bootstrap | null = null;

  get mongo(): IMongoInstance {
    return this._mongo!;
  }

  set mongo(value: IMongoInstance) {
    this._mongo = value;
  }

  get broker(): Broker {
    return this._broker!;
  }

  set broker(value: Broker) {
    this._broker = value;
  }

  get controllers(): Bootstrap {
    return this._controllers!;
  }

  set controllers(val: Bootstrap) {
    this._controllers = val;
  }

  @Log.decorateLog('State', 'App closed')
  kill(): void {
    this.mongo.disconnect();
    this.broker.close();
  }
}

export default new State();
