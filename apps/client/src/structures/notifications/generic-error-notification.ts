import { ErrorNotification } from './error-notification';

export class GenericErrorNotification extends ErrorNotification {
  constructor(error: Error) {
    super(error.message);
  }
}
