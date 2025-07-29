import AbstractRepository from '../../../../tools/abstractions/repository.js';
import type * as enums from '../../../../enums/index.js';
import type Sample from '../../model.js';
import type { ISample } from '../../types.js';
import type { ISampleRepository } from '../types.js';

export default class SampleRepository
  extends AbstractRepository<ISample, typeof Sample, enums.EControllers.Sample>
  implements ISampleRepository
{
  async remove(id: string): Promise<void> {
    await this.model.findOneAndDelete({ _id: id });
  }
}
