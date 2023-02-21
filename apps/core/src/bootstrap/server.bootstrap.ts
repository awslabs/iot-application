import { NestFastifyApplication } from '@nestjs/platform-fastify';

/** Server bootup script */
export const bootstrapServer = async (app: NestFastifyApplication) => {
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
};
