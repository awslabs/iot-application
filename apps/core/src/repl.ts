import { repl } from "@nestjs/core";
import { AppModule } from "./app.module";

/**
 * Main() for Core REPL
 *
 * @regards
 *
 * With the IoT Application Core REPL, the internals of Core are directly
 * accessible.
 *
 * To get started, run `pnpm repl` and the Core REPL will boot.
 *
 * @see {@link https://docs.nestjs.com/recipes/repl}
 * @see {@link https://docs.nestjs.com/recipes/repl#watch-mode}
 *
 * @internal
 */
async function bootstrap() {
  const replServer = await repl(AppModule);

  // enables persistence of REPL commands
  replServer.setupHistory(".nestjs_repl_history", (err) => {
    if (err) {
      console.error(err);
    }
  });
}

void bootstrap();
