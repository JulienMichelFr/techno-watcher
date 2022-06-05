import { CallHandler } from '@nestjs/common';
import { Expose } from 'class-transformer';
import { Observable, of } from 'rxjs';

import { Paginated } from '@techno-watcher/api-models';

import { SerializerInterceptor } from './serializer.interceptor';

describe('SerializerInterceptor', () => {
  interface Input {
    id: number;
    name: string;
    extraValue: string;
  }

  class Response implements Input {
    @Expose()
    public id!: number;
    @Expose()
    public name!: string;

    public extraValue!: string;

    public constructor(id: number, name: string) {
      this.id = id;
      this.name = name;
    }
  }

  function createCallHandler(value: Input | Paginated<Input>): CallHandler<Input | Paginated<Input>> {
    return {
      handle(): Observable<Input | Paginated<Input>> {
        return of(value);
      },
    };
  }

  let serializerInterceptor: SerializerInterceptor<Response, Input>;
  const data: Input = {
    id: 1,
    name: 'test',
    extraValue: 'extra',
  };

  beforeEach(() => {
    serializerInterceptor = new SerializerInterceptor(Response);
  });

  it('should be defined', () => {
    expect(serializerInterceptor).toBeDefined();
  });

  it('should serialize data', (done) => {
    expect.assertions(2);

    serializerInterceptor.intercept(null, createCallHandler(data)).subscribe((result) => {
      expect(result).toBeInstanceOf(Response);
      expect(result).toEqual(new Response(data.id, data.name));
      done();
    });
  });

  it('should serialize paginatedData', (done) => {
    expect.assertions(2);
    const paginatedData: Paginated<Input> = { data: [data], to: 1, from: 0, perPage: 10, total: 1 };

    serializerInterceptor.intercept(null, createCallHandler(paginatedData)).subscribe((result: Paginated<Response>) => {
      expect(result.data[0]).toBeInstanceOf(Response);
      expect(result.data[0]).toEqual(new Response(data.id, data.name));
      done();
    });
  });

  it('should ignore extraneaous values', (done) => {
    expect.assertions(1);

    serializerInterceptor.intercept(null, createCallHandler(data)).subscribe((result: Paginated<Response>) => {
      expect(Object.keys(result)).toEqual(['id', 'name']);
      done();
    });
  });
});
