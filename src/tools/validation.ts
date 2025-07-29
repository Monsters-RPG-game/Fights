import RawValidation, { IncorrectArgTypeError } from '@monsters/validator';
import mongoose from 'mongoose';

export default class Validation extends RawValidation {
  /**
   * Validate if element is typeof mongoose.ObjectId
   * Require param: string.
   */
  isObjectId(): this {
    const { v, name } = this;
    const value = v as string;

    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new IncorrectArgTypeError(`${name} should be objectId`);
    }

    return this;
  }

  /**
   * Validate if element has children, which are typeof objectId
   * Require param: array of numbers.
   */
  isObjectIdArray(): this {
    const { v, name } = this;
    const value = v as string[];

    if (!Array.isArray(value)) throw new IncorrectArgTypeError(`${name} should be array`);
    if (value.length === 0) return this;

    value.forEach((e) => {
      if (!mongoose.Types.ObjectId.isValid(e)) throw new IncorrectArgTypeError(`${name}.${e} should be objectId`);
    });

    return this;
  }
}
