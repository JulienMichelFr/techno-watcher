import { ArgumentsHost, Catch, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { JsonWebTokenError } from 'jsonwebtoken';

@Catch(JsonWebTokenError)
export class JwtExceptionFilter extends BaseExceptionFilter {
  private static getException(exception: JsonWebTokenError): ForbiddenException {
    switch (exception.name) {
      case 'TokenExpiredError':
        return new UnauthorizedException('Token is expired');
      default:
        return new UnauthorizedException('Token is invalid');
    }
  }

  public override catch(exception: JsonWebTokenError, host: ArgumentsHost): void {
    super.catch(JwtExceptionFilter.getException(exception), host);
  }
}
