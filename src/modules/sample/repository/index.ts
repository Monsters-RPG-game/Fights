import Log from 'simpl-loggar';
import MongoSampleRepository from './logic/mongo.js';
import { NoRepositoryControllerSpecified } from '../../../errors/index.js';
import ConfigLoader from '../../../tools/config/index.js';
import Sample from '../model.js';
import type { ISampleRepository } from './types.js';
import type { ISampleEntity } from '../entity.js';
import type mongoose from 'mongoose';

class SampleRepository implements ISampleRepository {
  constructor(repository: ISampleRepository) {
    this.repository = repository;
  }

  private accessor repository: ISampleRepository;

  async get(id: string | mongoose.Types.ObjectId): Promise<ISampleEntity | null> {
    return this.repository.get(id);
  }
}

export default class SampleFacade {
  static createInstance(): ISampleRepository {
    const repositoryTarget = ConfigLoader.getConfig().repository;

    switch (repositoryTarget) {
      case 'mongo':
        SampleFacade.instance = new SampleRepository(new MongoSampleRepository(Sample));
        return SampleFacade.instance;
      default:
        Log.error('No repository controller specified. Please specify type of controller in config files');
        throw new NoRepositoryControllerSpecified();
    }
  }

  private static accessor instance: ISampleRepository | undefined = undefined;
}
