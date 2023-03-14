const ENV_VAR_UNDEFINED = 'undefined';

/**
 * Parses the environment variable into a string if the variable is defined; otherwise, throws the given error.
 * @param variable the environment variable to parse
 * @param error the given error to throw if the variable is not defined
 * @returns the environment variable in string type
 */
export const sanitizeEnvVarOrThrow = (
  variable: string | undefined,
  error: Error,
): string => {
  if (variable === undefined || variable === ENV_VAR_UNDEFINED) {
    throw error;
  }

  return variable;
};
