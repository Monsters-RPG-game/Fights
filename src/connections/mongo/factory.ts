import mongoose from 'mongoose';
import Log from 'simpl-loggar';
import ConfigLoader from '../../tools/config/index.js';
import State from '../../tools/state.js';
import type { IMongoInstance } from './types.js';
import type { ConnectOptions } from 'mongoose';

class Mongo implements IMongoInstance {
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      Log.debug('Mongo', 'Connecting to mongo');

      mongoose
        .connect(ConfigLoader.getConfig().mongo.url, {
          dbName: ConfigLoader.getConfig().mongo.db,
          serverSelectionTimeoutMS: 5000,
        } as ConnectOptions)
        .then(() => {
          Log.debug('Mongo', 'Instance connected');
        })
        .catch((err) => {
          Log.debug('Mongo', 'Instance connection failed');
          reject(new Error((err as Error).message));
        });

      mongoose.connection.on('connected', () => {
        Log.log('Mongo', 'Connected');
        resolve();
      });
      mongoose.connection.on('disconnected', () => Log.error('Mongo', 'Disconnected'));
      mongoose.connection.on('reconnected', () => Log.warn('Mongo', 'Reconnected'));
      mongoose.connection.on('error', (err) => {
        Log.error('Mongo connection error', err);
        // Kill application on any kind of connection error
        State.kill();
      });
    });
  }

  disconnect(): void {
    mongoose.disconnect().catch((err) => {
      Log.error('Mongo', 'Cannot disconnect', (err as Error).message);
    });
  }
}

class MockMongo extends Mongo implements IMongoInstance {
  override async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      Log.debug('Mongo', 'Connecting to mocked mongo');

      mongoose
        .connect(ConfigLoader.getConfig().mongo.url, {
          dbName: ConfigLoader.getConfig().mongo.testDb,
          serverSelectionTimeoutMS: 5000,
        } as ConnectOptions)
        .then(() => {
          Log.debug('Mongo', 'Instance connected');
        })
        .catch((err) => {
          Log.debug('Mongo', 'Instance connection failed');
          reject(new Error((err as Error).message));
        });

      mongoose.connection.on('connected', () => {
        Log.log('Mongo', 'Connected');
        resolve();
      });
      mongoose.connection.on('disconnected', () => Log.error('Mongo', 'Disconnected'));
      mongoose.connection.on('reconnected', () => Log.warn('Mongo', 'Reconnected'));
      mongoose.connection.on('error', (err) => {
        Log.error('Mongo connection error', err);
        // Kill application on any kind of connection error
        State.kill();
      });
    });
  }
}

export default class MongoFactory {
  private static accessor instance: IMongoInstance | undefined = undefined;

  static async create(): Promise<IMongoInstance> {
    if (!MongoFactory.instance)
      process.env.NODE_ENV === 'test' ? await MongoFactory.createMockServer() : await MongoFactory.createServer();

    return MongoFactory.instance!;
  }

  @Log.decorateLog('Mongo', 'Started mock server')
  private static async createMockServer(): Promise<void> {
    MongoFactory.instance = new MockMongo();
    await MongoFactory.instance.init();
  }

  private static async createServer(): Promise<void> {
    MongoFactory.instance = new Mongo();
    await MongoFactory.instance.init();
  }
}
