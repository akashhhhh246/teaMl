import { ValidationError } from '../errors/AppError.js';

export function validateAuthRegister(req, res, next) {
  const { email, password, name } = req.body;
  const errors = {};

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'A valid email address is required.';
  }
  if (!password || password.length < 6) {
    errors.password = 'Password must be at least 6 characters long.';
  }
  if (!name || name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters long.';
  }

  if (Object.keys(errors).length > 0) {
    return next(new ValidationError('Invalid registration parameters', errors));
  }
  next();
}

export function validateAuthLogin(req, res, next) {
  const { email, password } = req.body;
  const errors = {};

  if (!email) errors.email = 'Email is required.';
  if (!password) errors.password = 'Password is required.';

  if (Object.keys(errors).length > 0) {
    return next(new ValidationError('Missing credentials', errors));
  }
  next();
}

export function validateReview(req, res, next) {
  const { teaId, rating, comment } = req.body;
  const errors = {};

  if (!teaId) errors.teaId = 'Tea ID is required.';
  if (!rating || rating < 1 || rating > 5) errors.rating = 'Rating must be an integer between 1 and 5.';
  if (!comment || comment.trim().length < 3) errors.comment = 'Review comment must be at least 3 characters.';

  if (Object.keys(errors).length > 0) {
    return next(new ValidationError('Invalid review submission', errors));
  }
  next();
}

export function validateMoodLog(req, res, next) {
  const { mood } = req.body;
  if (!mood) {
    return next(new ValidationError('Mood selection is required.'));
  }
  next();
}
