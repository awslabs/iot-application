import { NestFastifyApplication } from '@nestjs/platform-fastify';

interface MaybeHotModule {
  hot?: {
    accept(): void;
    dispose(cb: () => Promise<void>): void;
  };
}

type HotModule = {
  [P in keyof MaybeHotModule]-?: MaybeHotModule['hot'];
};

const isHotModule = (module: MaybeHotModule): module is HotModule => {
  return module.hot != null;
};

const handleHotModule = (module: HotModule, app: NestFastifyApplication) => {
  module.hot.accept();
  module.hot.dispose(() => app.close());
};

/** Webpack module (value is injected at runtime by Webpack) */
declare const module: MaybeHotModule;

/**
 * HMR bootup script
 *
 * @regards
 *
 * @see {@link http://docs.nestjs.com/recipes/hot-reload | Hot Reload}
 *
 * @internal
 */
export const bootstrapHmr = (app: NestFastifyApplication) => {
  if (isHotModule(module)) {
    handleHotModule(module, app);
  }
};
