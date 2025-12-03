import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { handler } from "./lambda";
import * as dotenv from "dotenv";
import {
  ValidationPipe,
  VERSION_NEUTRAL,
  VersioningType,
} from "@nestjs/common";
import compression from "compression";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { apiReference } from "@scalar/nestjs-api-reference";
import { Request, Response } from "express";
import * as bodyParser from "body-parser";
import { Logger } from "nestjs-pino";

dotenv.config();

if (process.env.IS_LOCAL) {
  console.log("Running locally", process.env.IS_LOCAL);

  async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
      new ValidationPipe({
        transform: false,
        whitelist: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    app.use(bodyParser.json());
    app.enableCors();
    app.useLogger(app.get(Logger));
    app.use(compression());
    app.enableVersioning({
      defaultVersion: [VERSION_NEUTRAL, "1"],
      type: VersioningType.HEADER,
      header: "X-Api-Version",
    });
    const config = new DocumentBuilder()
      .setTitle("Form builder backend API.")
      .setDescription("Form builder backend API for NRL.")
      .setVersion("1.0.0")
      .build();

    const document = SwaggerModule.createDocument(app, config);
    const swaggerCDN = "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.7.2";
    SwaggerModule.setup("swagger", app, document, {
      customCssUrl: [`${swaggerCDN}/swagger-ui.css`],
      customJs: [
        `${swaggerCDN}/swagger-ui-bundle.js`,
        `${swaggerCDN}/swagger-ui-standalone-preset.js`,
      ],
    });
    app.use("/swagger-json", (req: Request, res: Response) => {
      res.json(document);
    });
    app.use(
      "/docs",
      apiReference({
        spec: {
          url: "/swagger-json",
        },
        defaultHttpClient: {
          targetKey: "node",
          clientKey: "axios",
        },
        metaData: {
          title: "Form builder backend API",
          description: "Form builder backend API for NRL.",
        },
      }),
    );
    await app.listen(3000);
  }

  bootstrap();
}

console.log("Running in AWS", process.env.IS_LOCAL);

export { handler };
