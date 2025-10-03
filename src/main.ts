import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const context = await NestFactory.createApplicationContext(AppModule);
  const config = context.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(config.getOrThrow<number>("PORT_MAIN"));
}
bootstrap();
