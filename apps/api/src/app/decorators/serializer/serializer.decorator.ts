import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { SerializerInterceptor } from '../../interceptors/serializer/serializer.interceptor';
import { ClassConstructor } from 'class-transformer';

export function Serializer<Response, Input>(model: ClassConstructor<Response>): MethodDecorator {
  return applyDecorators(UseInterceptors(new SerializerInterceptor<Response, Input>(model)));
}
