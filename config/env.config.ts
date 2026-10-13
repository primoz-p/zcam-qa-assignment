// config/env.config.ts
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({path: path.resolve(__dirname, '../.env')});

export const CONFIG = {
  UI: {
    BASE_URL: process.env.ORANGEHRM_BASE_URL || 'https://opensource-demo.orangehrmlive.com',
    CREDENTIALS: {
      ADMIN: {
        USERNAME: process.env.ORANGEHRM_USERNAME || 'Admin',
        PASSWORD: process.env.ORANGEHRM_PASSWORD || 'admin123',
      },
    },
  },
  API: {
    BASE_URL: process.env.PETSTORE_BASE_URL || 'https://petstore.swagger.io/v2/',
  },
};
