import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';

import { Paginated } from '@techno-watcher/api-models';

@Injectable()
export class SerializerInterceptor<Response, Input> implements NestInterceptor {
  public constructor(private readonly model: ClassConstructor<Response>) {}

  public intercept(context: ExecutionContext, next: CallHandler<Input | Paginated<Input>>): Observable<Response | Paginated<Response>> {
    return next.handle().pipe(
      map((data) => {
        if (this.isPaginated(data)) {
          return {
            ...data,
            data: data.data.map((value) => this.serialize(value)),
          };
        }
        return this.serialize(data);
      })
    );
  }

  private serialize(data: Input): Response {
    return plainToInstance(this.model, data, { excludeExtraneousValues: true });
  }

  private isPaginated(data: Input | Paginated<Input>): data is Paginated<Input> {
    const keys: string[] = Object.keys(data);
    return keys.includes('data') && keys.includes('total') && keys.includes('perPage') && keys.includes('from') && keys.includes('to');
  }
}
