import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { INestApplicationContext, ValidationPipe } from "@nestjs/common";
import { SpelunkerModule } from "nestjs-spelunker";
import cookieParser from "cookie-parser";
import { NestExpressApplication } from "@nestjs/platform-express";

async function spelunker(app: INestApplicationContext) {
  const tree = SpelunkerModule.explore(app);
  const root = SpelunkerModule.graph(tree);
  const edges = SpelunkerModule.findGraphEdges(root);
  console.log("graph LR");
  const mermaidEdges = edges.map(({ from, to }) => `  ${from.module.name}-->${to.module.name}`);
  console.log(mermaidEdges.join("\n"));
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const context = await NestFactory.createApplicationContext(AppModule);
  const config = context.get(ConfigService);

  app.set("trust proxy", true);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser(config.getOrThrow<string>("COOKIE_SECRET")));
  app.enableCors({
    credentials: true,
    //** IMPORTANT: ONLY FOR DEBUGGING */
    origin: "*",
  });
  spelunker(app);
  await app.listen(config.getOrThrow<number>("PORT_MAIN"), "0.0.0.0", () =>
    console.log(`listening on: ${config.getOrThrow<number>("PORT_MAIN")}`),
  );
}
bootstrap();
