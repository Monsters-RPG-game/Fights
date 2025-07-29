import type { ISampleEntity } from './entity.js';
import type mongoose from 'mongoose';

export interface ISample extends ISampleEntity, mongoose.Document {
  _id: mongoose.Types.ObjectId;
}
