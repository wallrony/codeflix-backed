import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(_: Request, response: Response, next: NextFunction): void {
    let data: string;

    const oldSend = response.send;
    response.send = function (resdata) {
      if (response.statusCode >= 400) {
        if (typeof resdata === 'string') {
          data = resdata;
        } else if (typeof resdata === 'object') {
          data = JSON.stringify(resdata);
        }
      }
      // eslint-disable-next-line prefer-rest-params
      return oldSend.apply(response, arguments);
    };

    response.on('close', () => {
      const { statusCode } = response;
      const message = this.formatLogMessage(response, data);
      if (statusCode >= 400) {
        this.logger.error(message);
      } else if (statusCode >= 300) {
        this.logger.warn(message);
      } else {
        this.logger.log(message);
      }
    });

    next();
  }

  private formatLogMessage(response: Response, data?: string): string {
    const userAgent = response.req.get('user-agent') || '';
    const {
      statusCode,
      req: { method, path, ip },
    } = response;
    const formattedPath = `"${path}"`;
    if (statusCode >= 400 && !!data) {
      return `${method} ${formattedPath} ${statusCode}: "${data}" - ${userAgent} ${ip}`;
    }
    return `${method} ${path} ${statusCode} - ${userAgent} ${ip}`;
  }
}
