export interface IMongoInstance {
  init: () => Promise<void>;
  disconnect: () => void;
}
