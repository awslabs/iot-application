import { IncomingMessage } from 'http';
import { ServerResponse } from 'http';
import { Options } from 'pino-http';

/**
 * Custom request serializer to include necessary informations only (omitted sensitive properties like headers).
 */
const requestSerializer = (req: IncomingMessage) => ({
  id: req.id,
  method: req.method,
  url: req.url,
});

/**
 * Custom response serializer to include necessary informations only (omitted sensitive properties like headers).
 */
const responseSerializer = (res: ServerResponse) => ({
  err: res.err,
  statusCode: res.statusCode,
  statusMessage: res.statusMessage,
});

const customReceivedObject = (req: IncomingMessage) => ({
  context: 'HttpRequestReceived',
  req,
});

const customSuccessObject = (
  _req: IncomingMessage,
  _res: ServerResponse,
  loggableObject: object,
) => ({
  ...loggableObject,
  context: 'HttpRequestCompleted',
});

const customErrorObject = (
  _req: IncomingMessage,
  _res: ServerResponse,
  _err: Error,
  loggableObject: object,
) => ({
  ...loggableObject,
  context: 'HttpRequestErrored',
});

export const pinoHttpConfigs: Options = {
  quietReqLogger: true,
  customReceivedObject,
  customSuccessObject,
  customErrorObject,
  serializers: {
    req: requestSerializer,
    res: responseSerializer,
  },
};
