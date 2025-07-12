import {
  PipeTransform,
  Injectable,
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { isMulterFile, isString } from '../helpers';

@Injectable()
export class FileTypeValidationPipe implements PipeTransform {
  private readonly accepts: string[];

  constructor(accepts: string[] | string) {
    this.accepts = isString(accepts) ? [accepts] : accepts;
  }

  transform(value: unknown) {
    if (!isMulterFile(value)) {
      throw new UnprocessableEntityException('This is not a file');
    }
    console.log('value.mimetype -->', value.mimetype);

    if (!this.accepts.includes(value.mimetype)) {
      throw new BadRequestException(
        `The file should be of the following type: ${this.accepts.join(', ')}`,
      );
    }
    return value;
  }
}
