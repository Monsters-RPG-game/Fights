import type mongoose from 'mongoose';

export interface ISampleEntity {
  _id: string | mongoose.Types.ObjectId;
  data: string;
}
