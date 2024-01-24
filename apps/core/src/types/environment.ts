export type Undefined = undefined | 'undefined';
export type Defined<T> = T;
export type Maybe<T> = Defined<T> | Undefined;

export function isUndefined<T>(maybe: Maybe<T>): maybe is Undefined {
  return maybe === undefined || maybe === 'undefined';
}

export function isDefined<T>(maybe: Maybe<T>): maybe is Defined<T> {
  return !isUndefined(maybe);
}

export function isDevEnv() {
  return process.env.NODE_ENV === 'development';
}

export const MetricModes = {
  Local: 'local',
  Cloud: 'cloud',
};

export const LogModes = {
  Local: 'local',
  Cloud: 'cloud',
};

export function getMetricsMode() {
  if (isDevEnv()) {
    return MetricModes.Local;
  }
  return MetricModes.Cloud;
}

export function getLogMode() {
  if (isDevEnv()) {
    return LogModes.Local;
  }
  return LogModes.Cloud;
}
