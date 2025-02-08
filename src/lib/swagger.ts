import { generateOpenApi } from '@ts-rest/open-api';
import { contract } from './apiContract';

export const OpenAPI = generateOpenApi(contract, {
  info: {
    title: 'Shelter Connect API',
    version: '1.0.0',
    description: 'API documentation for Shelter Connect',
  },
});
