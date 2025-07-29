import type GetSampleDto from './dto.js';
import type { IAbstractSubController } from '../../../../types/index.js';
import type { ISampleEntity } from '../../entity.js';
import type { ISampleRepository } from '../../repository/types.js';

export default class GetSampleController implements IAbstractSubController<ISampleEntity | null> {
  constructor(repo: ISampleRepository) {
    this.repo = repo;
  }

  private accessor repo: ISampleRepository;

  async execute(data: GetSampleDto): Promise<ISampleEntity | null> {
    return this.repo.get(data.id);
  }
}
