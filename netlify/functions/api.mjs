import { withLambda } from '@netlify/aws-lambda-compat';
import api from '../../dist/apps/api/netlify.js';

export default withLambda(api.handler);
