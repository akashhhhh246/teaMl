import { AppError } from '../errors/AppError.js';
import { ApiResponse } from '../utils/response.js';
import { HTTP_STATUS } from '../constants/index.js';

export function errorHandler(err, req, res, next) {
  console.error('[ERROR HANDLER]', err);

  if (err instanceof AppError) {
    return ApiResponse.error(res, err.message, err.statusCode, err.errors);
  }

  // Handle Prisma Known Request Errors
  if (err.code === 'P2002') {
    return ApiResponse.error(res, 'A unique constraint violation occurred.', HTTP_STATUS.CONFLICT);
  }

  if (err.code === 'P2025') {
    return ApiResponse.error(res, 'Record not found in database.', HTTP_STATUS.NOT_FOUND);
  }

  const isProd = process.env.NODE_ENV === 'production';
  return ApiResponse.error(
    res,
    isProd ? 'An internal server error occurred.' : err.message,
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    isProd ? null : { stack: err.stack }
  );
}

export function notFoundHandler(req, res, next) {
  return ApiResponse.error(res, `Cannot ${req.method} ${req.originalUrl}`, HTTP_STATUS.NOT_FOUND);
}
