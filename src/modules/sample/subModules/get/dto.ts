import Validation from '../../../../tools/validation.js';
import type { IGetSampleDto } from './types.js';

export default class GetSampleDto implements IGetSampleDto {
  id: string;

  constructor(data: IGetSampleDto) {
    this.id = data.id;

    this.validate();
  }

  private validate(): void {
    new Validation(this.id, 'id').isDefined().isString().isObjectId();
  }
}
