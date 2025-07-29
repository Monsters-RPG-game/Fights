import Broker from '../../../src/connections/broker/index.js'
import { EMessageTypes } from '../../../src/enums/connections.js';

export default class FakeBroker extends Broker {
  private accessor messages: {payload: unknown, target: EMessageTypes, userId: string}[] = []

  override async init(): Promise<void> {
    return new Promise(resolve => {
      resolve()
    })
  }

  override send(userId: string, payload: unknown, target: EMessageTypes): void {
    this.messages.push({ payload, target, userId });
  }

  getFirstMessages(amount: number): { payload: unknown, target: EMessageTypes, userId: string }[] {
    const data = this.messages.slice(0, amount);
    this.messages = this.messages.slice(amount);
    return data;
  }
}
