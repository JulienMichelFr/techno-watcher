import { ArgumentsHost, Catch, ForbiddenException } from '@nestjs/common';
import { JsonWebTokenError } from 'jsonwebtoken';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch(JsonWebTokenError)
export class JwtExceptionFilter extends BaseExceptionFilter {
  private static getException(exception: JsonWebTokenError): ForbiddenException {
    switch (exception.name) {
      case 'TokenExpiredError':
        return new ForbiddenException('Token is expired');
      default:
        return new ForbiddenException('Token is invalid');
    }
  }

  public override catch(exception: JsonWebTokenError, host: ArgumentsHost): void {
    super.catch(JwtExceptionFilter.getException(exception), host);
  }
}
