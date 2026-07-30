import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

// custom pipe to santize the username
@Injectable()
export class SantizeUsernamePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value || typeof value !== 'string') {
      throw new BadRequestException(`User name must be a string`);
    }
    return value.trim().toLowerCase();
  }
}
