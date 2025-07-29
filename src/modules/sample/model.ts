import mongoose from 'mongoose';
import * as enums from '../../enums/index.js';
import { EDbCollections } from '../../enums/index.js';
import type { ISample } from './types.js';

export const sampleSchema = new mongoose.Schema({
  data: {
    type: String,
    required: [true, 'Data not provided'],
  },
});

const Sample = mongoose.model<ISample>(enums.EModels.Sample, sampleSchema, EDbCollections.Sample);
export default Sample;
