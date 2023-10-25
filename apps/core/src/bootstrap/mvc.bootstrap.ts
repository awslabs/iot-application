import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { join } from 'path';
import Handlebars from 'handlebars';

const CLIENT_BUILD_FOLDER = join(process.cwd(), '..', 'client', 'build');

export const bootstrapMvc = (app: NestFastifyApplication) => {
  app.useStaticAssets({
    root: join(CLIENT_BUILD_FOLDER),
  });

  app.setViewEngine({
    engine: {
      handlebars: Handlebars,
    },
    templates: CLIENT_BUILD_FOLDER,
  });
};
