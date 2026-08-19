import { HTTP_STATUS } from '../constants/index.js';

export class ApiResponse {
  static success(res, data = null, message = 'Operation successful', statusCode = HTTP_STATUS.OK, meta = null) {
    const responsePayload = {
      success: true,
      statusCode,
      message,
      data,
    };
    if (meta) {
      responsePayload.meta = meta;
    }
    return res.status(statusCode).json(responsePayload);
  }

  static created(res, data = null, message = 'Resource created successfully') {
    return this.success(res, data, message, HTTP_STATUS.CREATED);
  }

  static error(res, message = 'An error occurred', statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, errors = null) {
    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      errors,
      timestamp: new Date().toISOString(),
    });
  }
}
