import { ArgumentsHost, Catch, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';

@Injectable()
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientKnownRequestExceptionFilter extends BaseExceptionFilter {
  private static getException(exception: Prisma.PrismaClientKnownRequestError): UnprocessableEntityException {
    let target: string[];
    switch (exception.code) {
      case 'P2002':
        target = exception.meta.target as string[];
        return new UnprocessableEntityException(`Could not create resource, ${target.join(', ')} ${target?.length > 1 ? 'are' : 'is'} already used`);
      default:
        return new UnprocessableEntityException('Could not create resource');
    }
  }

  public override catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost): void {
    super.catch(PrismaClientKnownRequestExceptionFilter.getException(exception), host);
  }
}
