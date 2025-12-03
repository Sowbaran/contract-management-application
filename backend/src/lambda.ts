import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ExpressAdapter } from "@nestjs/platform-express";
import express from "express";
import { configure } from "@vendia/serverless-express";
import compression from "compression";
import {
  ValidationPipe,
  VERSION_NEUTRAL,
  VersioningType,
} from "@nestjs/common";
import { Request, Response } from "express";
import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { apiReference } from "@scalar/nestjs-api-reference";
import * as bodyParser from "body-parser";
import { Logger } from "nestjs-pino";

async function bootstrap() {
  const expressApp = express();
  const app: INestApplication = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      transform: false,
      whitelist: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.use(bodyParser.json());
  app.enableCors();
  app.use(compression());
  app.useLogger(app.get(Logger));
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

  await app.init();
  return expressApp;
}
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
let cachedServer: any;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const handler = async (event: any, context: any) => {
  if (!cachedServer) {
    const expressApp = await bootstrap();
    cachedServer = configure({ app: expressApp });
  }
  return cachedServer(event, context);
};

module.exports.handler = handler;
