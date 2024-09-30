import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
    BadRequestException,
} from '@nestjs/common';
import * as Joi from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
    constructor(private readonly schema: Joi.ObjectSchema) { }
    transform(value: any, metadata: ArgumentMetadata) {
        if (metadata.type === 'body') {
            const { error } = this.schema.validate(value, { abortEarly: false });
            if (error) {
                throw new BadRequestException('Validation failed', error.message);
            }
        }
        return value;
    }
}