import dotenv from 'dotenv';
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  jwtSecret: process.env.JWT_SECRET || 'teaml_super_secret_jwt_token_key_2026_enterprise_production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  mlServiceUrl: process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000/api/v1',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:7000',
  rateLimitWindowMs: 15 * 60 * 1000,
  rateLimitMax: 300,
};
