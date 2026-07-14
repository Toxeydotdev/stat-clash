import '@nestjs/common';
import '@nestjs/core';
import '@nestjs/platform-express';
import { withLambda } from '@netlify/aws-lambda-compat';
import 'express';
import 'reflect-metadata';
import 'rxjs';
import 'serverless-http';
import 'tslib';
import api from '../../dist/apps/api/netlify.js';

export default withLambda(api.handler);
