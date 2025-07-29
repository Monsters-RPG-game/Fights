import amqplib from 'amqplib';
import Log from 'simpl-loggar';
import Router from './router.js';
import * as enums from '../../enums/index.js';
import { NotConnectedError } from '../../errors/index.js';
import ConfigLoader from '../../tools/config/index.js';
import sleep from '../../utils/index.js';
import type * as types from '../../types/index.js';

export default class Broker {
  private _connection: amqplib.ChannelModel | undefined;
  private _connectionTries = 0;
  private _channel: amqplib.Channel | undefined;
  private _channelTries = 0;
  private _queue: Record<string, types.IRabbitMessage> = {};
  private readonly _router: Router;

  constructor() {
    this._router = new Router();
  }

  private get router(): Router {
    return this._router;
  }

  async init(): Promise<void> {
    await this.initCommunication();
  }

  send(userId: string, payload: unknown, target: enums.EMessageTypes): void {
    const body = { ...this._queue[userId], payload, target };
    delete this._queue[userId];
    if (!this._channel) throw new NotConnectedError();
    this._channel.publish(ConfigLoader.getConfig().amqp.gatewayQueue, '', Buffer.from(JSON.stringify(body)));
  }

  close(): void {
    if (!this._connection) return;

    this._connection
      .close()
      .then(() => {
        this.cleanAll();
      })
      .catch(() => null);
  }

  private sendHeartbeat(payload: unknown, target: enums.EMessageTypes): void {
    const body = { payload, target };
    if (!this._channel) throw new NotConnectedError();
    this._channel.publish(ConfigLoader.getConfig().amqp.gatewayQueue, '', Buffer.from(JSON.stringify(body)));
  }

  private async reconnect(): Promise<void> {
    this.close();
    await this.initCommunication();
  }

  private async initCommunication(): Promise<void> {
    if (this._connectionTries++ > parseInt(Number(enums.ERabbit.RetryLimit).toString())) {
      Log.error('Rabbit', 'Gave up connecting to rabbit. Is rabbit dead?');
      throw new Error('Gave up connecting to rabbit. Is rabbit dead?');
    }

    try {
      const connection = await amqplib.connect(ConfigLoader.getConfig().amqp.url);

      Log.log('Rabbit', 'Connected to rabbit');
      this._connection = connection;
      connection.on('close', () => this.close());
      connection.on('error', () => this.reconnect());
      await this.createChannels();
    } catch (err) {
      const error = err as types.IFullError;
      Log.warn('Rabbit', 'Error connecting to RabbitMQ, retrying in 1 second');
      Log.error('Rabbit', error.message, error.stack);
      await sleep(1000);
      await this.initCommunication();
      this._connection = undefined;
    }
  }

  private async createChannels(): Promise<void> {
    if (this._channel) return;
    if (!this._connection) throw new NotConnectedError();
    if (this._channelTries++ > parseInt(Number(enums.ERabbit.RetryLimit).toString())) {
      Log.error('Rabbit', 'Error creating rabbit connection channel, stopped retrying');
    }

    try {
      const channel = await this._connection.createChannel();
      Log.log('Rabbit', 'Channel connected');
      this._channel = channel;
      channel.on('close', () => this.cleanAll());
      channel.on('error', () => this.reconnectChannel());
      await this.createQueue();
    } catch (err) {
      const error = err as types.IFullError;
      Log.error('Rabbit', error.message, error.stack);
      Log.error(
        'Rabbit',
        `Error creating rabbit connection channel, retrying in 1 second: ${(err as types.IFullError).message}`,
      );
      await sleep(1000);
      await this.createChannels();
      this._channel = undefined;
    }
  }

  private async createQueue(): Promise<void> {
    Log.log('Rabbit', `Creating queue: ${ConfigLoader.getConfig().amqp.gatewayQueue}`);
    Log.log('Rabbit', `Creating queue: ${ConfigLoader.getConfig().amqp.myQueue}`);

    await this._channel!.assertQueue(ConfigLoader.getConfig().amqp.gatewayQueue, { durable: true });
    await this._channel!.assertQueue(ConfigLoader.getConfig().amqp.myQueue, { durable: true });
    await this._channel!.consume(
      ConfigLoader.getConfig().amqp.myQueue,
      (message) => {
        if (!message) return;
        const payload = JSON.parse(message.content.toString()) as types.IRabbitMessage;
        if (payload.target === enums.EMessageTypes.Heartbeat) {
          this.sendHeartbeat(ConfigLoader.getConfig().amqp.myService, enums.EMessageTypes.Heartbeat);
        } else {
          this._queue[payload.user.tempId] = payload;
          this.errorWrapper(async () => this.router.handleMessage(payload), payload.user.tempId);
        }
      },
      { noAck: true },
    );
    return this.sendHeartbeat(ConfigLoader.getConfig().amqp.myService, enums.EMessageTypes.Heartbeat);
  }

  private async closeChannel(): Promise<void> {
    await this._channel!.purgeQueue(ConfigLoader.getConfig().amqp.myQueue);
    await this._channel!.deleteQueue(ConfigLoader.getConfig().amqp.myQueue);

    await this._channel!.close().catch(() => null);
    this._channel = undefined;
    this._channelTries = 0;
  }

  private async reconnectChannel(): Promise<void> {
    Log.error('Rabbit', 'Got err. Reconnecting');

    try {
      await this.closeChannel();
      await this.createChannels();
    } catch (err) {
      const error = err as types.IFullError;
      Log.error('Rabbit', "Couldn't create channels");
      Log.error('Rabbit', error.message, error.stack);
    }
  }

  private cleanAll(): void {
    this._channel = undefined;
    this._connection = undefined;
    this._connectionTries = 0;
    this._channelTries = 0;
  }

  private errorWrapper(func: () => Promise<void>, user: string): void {
    func().catch((err) => {
      const { message, name, code, status, stack } = err as types.IFullError;
      Log.error('Modules', 'Generic err', message, stack);
      if (!status) {
        this.send(user, { message, name, code, status: 500 }, enums.EMessageTypes.Error);
      } else {
        this.send(user, { message, name, code, status }, enums.EMessageTypes.Error);
      }
    });
  }
}
