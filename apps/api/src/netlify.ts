import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import type {
  HandlerContext,
  HandlerEvent,
  HandlerResponse,
} from '@netlify/aws-lambda-compat';
import express = require('express');
import serverlessHttp = require('serverless-http');
import { AppModule } from './app/app.module';
import { configureApp } from './configure-app';

type ServerlessHandler = ReturnType<typeof serverlessHttp>;

export interface ServerlessApi {
  close: () => Promise<void>;
  handler: ServerlessHandler;
}

export async function createServerlessApi(): Promise<ServerlessApi> {
  const expressApp = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

  configureApp(app);
  await app.init();

  return {
    close: () => app.close(),
    handler: serverlessHttp(expressApp),
  };
}

let handlerPromise: Promise<ServerlessHandler> | undefined;

function getHandler(): Promise<ServerlessHandler> {
  handlerPromise ??= createServerlessApi().then(({ handler }) => handler);
  return handlerPromise;
}

export async function handler(
  event: HandlerEvent,
  context: HandlerContext,
): Promise<HandlerResponse> {
  const serverlessHandler = await getHandler();
  return (await serverlessHandler(event, context)) as HandlerResponse;
}
