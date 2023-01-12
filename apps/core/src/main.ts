import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";

const createApp = async () => {
  return NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
};

const main = async () => {
  const app = await createApp();
  await app.listen(3000);
};

export let coreViteApp: ReturnType<(typeof NestFactory)["create"]>;

if (import.meta.env.PROD) {
  void main();
} else {
  coreViteApp = createApp();
}
