import type { ISampleEntity } from '../entity.js';
import type mongoose from 'mongoose';

export interface ISampleRepository {
  get(id: string | mongoose.Types.ObjectId): Promise<ISampleEntity | null>;
}
