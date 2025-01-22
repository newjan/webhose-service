import { NextFunction, Request, Response } from 'express';
import logger from '@/logger';
import _ from 'lodash';

function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  const originalJson = res.json;

  let responseBody: any;
  let errorStack: any;

  // Intercept the json method to capture the response body
  res.json = function (body) {
    errorStack = body.errorStack;
    responseBody = _.omit(body, 'errorStack');
    return originalJson.call(this, responseBody);
  };

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logFragments = [
      req.method,
      req.originalUrl,
      `[${res.statusCode}]`,
      `${duration}ms`,
    ];

    if (!_.isEmpty(req.body)) {
      logFragments.push(`[REQUEST] ${JSON.stringify(req.body)}`);
    }

    logFragments.push(`[RESPONSE] ${JSON.stringify(responseBody ?? {})}`);

    if (errorStack) {
      logFragments.push('\n');
      logFragments.push(errorStack);
    }

    const logMessage = logFragments.join(' ');

    if (res.statusCode >= 500) {
      logger.error(logMessage);
    } else if (res.statusCode >= 400) {
      logger.warn(logMessage);
    } else {
      logger.info(logMessage);
    }
  });

  next();
}

export default requestLogger;
