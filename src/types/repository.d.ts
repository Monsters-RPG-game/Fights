import type * as enums from '../enums/index.js';
import type { ISampleEntity } from '../modules/sample/entity.js';

export interface IRepositoryAddData {
  [enums.EControllers.Sample]: ISampleEntity; // This should include dto for adding data, but due to lack of actions for it, it just include entity
}

export interface IRepositoryAddDefaultData {
  [enums.EControllers.Sample]: Partial<ISampleEntity>;
}

export interface IRepositoryGetData {
  [enums.EControllers.Sample]: ISampleEntity | null;
}

export interface IRepositoryUpdate {
  [enums.EControllers.Sample]: Partial<ISampleEntity>;
}

export interface IAbstractRepository<Z extends enums.EControllers> {
  add(data: IRepositoryAddData[Z]): Promise<string>;
  get(data: unknown): Promise<IRepositoryGetData[Z]>;
}
