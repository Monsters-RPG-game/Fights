import Log from 'simpl-loggar';
import { EConfigEnvs, EConfigKeys } from './enums.js';
import { InvalidConfigError } from '../../errors/index.js';
import type * as types from '../../types/index.js';
import fs from 'fs';
import path from 'path';

export default class ConfigLoader {
  private static _config: types.IConfigInterface | undefined;

  private static get config(): types.IConfigInterface | undefined {
    return ConfigLoader._config;
  }

  private static set config(val: types.IConfigInterface) {
    ConfigLoader._config = val;
  }

  /**
   * Load config from json files.
   * @returns Config loaded from file.
   * @throws Error that no config was found.
   */
  static getConfig(): types.IConfigInterface {
    if (ConfigLoader.config) return ConfigLoader.config;

    try {
      let config: Partial<types.IConfigInterface> = {
        amqp: {
          url: '',
          myQueue: '',
          gatewayQueue: '',
          myService: '',
          gatewayService: '',
        },
        mongo: {
          url: '',
          db: '',
          testDb: '',
        },
        repository: '',
      };

      switch (process.env.NODE_ENV) {
        case 'development':
          config = this.readConfig('devConfig.json');
          break;
        case 'production':
          config = this.readConfig('prodConfig.json');
          break;
        case 'test':
          config = this.readConfig('testConfig.json');
          break;
        default:
          Log.error('Config loader', 'No env provided');
          throw new Error('No config files');
      }

      config = ConfigLoader.loadFromEnv(config);
      ConfigLoader.preValidate(config);

      return config as types.IConfigInterface;
    } catch (err) {
      Log.error('Config loader', 'Got error while reading config files', (err as Error).message);
      throw new InvalidConfigError((err as Error).message);
    }
  }

  /**
   * Validate if config is correct.
   */
  static validateConfig(): void {
    ConfigLoader.getConfig();
  }

  /**
   * Prepare config path.
   * @param target
   * @param fallback
   */
  private static getPath(target: string, fallback: boolean = false): string {
    const basePath = import.meta.url.split('/');
    const dots = ['..', '..', '..', '..', 'config'];
    if (fallback) dots.unshift('..');

    return path.join(basePath.splice(2, basePath.length - 1).join('/'), ...dots, target);
  }

  /**
   * Read config file.
   * @param target
   */
  private static readConfig(target: string): types.IConfigInterface {
    try {
      return JSON.parse(fs.readFileSync(ConfigLoader.getPath(target)).toString()) as types.IConfigInterface;
    } catch (_err) {
      return JSON.parse(fs.readFileSync(ConfigLoader.getPath(target, true)).toString()) as types.IConfigInterface;
    }
  }

  /**
   * Validate if config includes all required keys.
   * @param config {types.IConfigInterfaceInterface} Config.
   * @returns {void} Void.
   */
  private static preValidate(config: Partial<types.IConfigInterface>): void {
    const configKeys = Object.values(EConfigKeys);

    configKeys.forEach((k) => {
      if (k.includes('.')) {
        // Split key for nested values and validate
        const split = k.split('.');
        if (
          split.reduce<Record<string, unknown>>(
            (acc, key) => acc?.[key as keyof types.IConfigInterface] as Record<string, unknown>,
            config,
          ) === undefined ||
          config[k as keyof types.IConfigInterface] === null
        ) {
          throw new Error(`Config is incorrect. ${k} is missing in config or is set to undefined`);
        }
      } else {
        if (
          config[k as keyof types.IConfigInterface] === undefined ||
          config[k as keyof types.IConfigInterface] === null
        ) {
          throw new Error(`Config is incorrect. ${k} is missing in config or is set to undefined`);
        }
      }
    });
  }

  /**
   * Prefill configuration files with env.
   * @description Prefill configuration file with ENVS provided in system.
   * @param config Existing configuration, loaded from files.
   */
  private static loadFromEnv(config: Partial<types.IConfigInterface>): Partial<types.IConfigInterface> {
    const envKeys = Object.keys(EConfigEnvs);

    envKeys.forEach((k) => {
      const key = EConfigKeys[k as EConfigEnvs];
      const target = process.env[k as EConfigEnvs];

      if (target === undefined || target.length === 0) return;

      switch (key) {
        case EConfigKeys.MONGO_URL:
          config.mongo!.url = target;
          break;
        case EConfigKeys.MONGO_DB:
          config.mongo!.db = target;
          break;
        case EConfigKeys.MONGO_TEST_DB:
          config.mongo!.testDb = target;
          break;
        case EConfigKeys.AMQP_URL:
          config.amqp!.url = target;
          break;
        case EConfigKeys.AMQP_MY_QUEUE:
          config.amqp!.myQueue = target;
          break;
        case EConfigKeys.AMQP_GATEWAY_QUEUE:
          config.amqp!.gatewayQueue = target;
          break;
        case EConfigKeys.AMQP_MY_SERVICE:
          config.amqp!.myService = target;
          break;
        case EConfigKeys.AMQP_GATEWAY_SERVICE:
          config.amqp!.gatewayService = target;
          break;
        default:
          (config[key] as string) = target;
          break;
      }
    });

    return config;
  }
}
