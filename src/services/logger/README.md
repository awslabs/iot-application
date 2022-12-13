### Logger

#### Usage

Import the logger object into any file. Log a message where appropriate using the logger's methods.

```
import logger from '..';

logger.log("message");
logger.error("message");
```

In development, messages will be logged to the console.

In production, messages will be logged to CloudWatch (to be built).
