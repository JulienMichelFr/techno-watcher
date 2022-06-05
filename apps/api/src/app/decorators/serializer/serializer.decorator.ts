import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';

import { SerializerInterceptor } from '../../interceptors/serializer/serializer.interceptor';

export function Serializer<Response, Input>(model: ClassConstructor<Response>): MethodDecorator {
  return applyDecorators(UseInterceptors(new SerializerInterceptor<Response, Input>(model)));
}
