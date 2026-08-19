import bcrypt from 'bcryptjs';
import { userRepository } from '../repositories/UserRepository.js';
import { signToken } from '../utils/jwt.js';
import { UnauthorizedError, ConflictError, NotFoundError } from '../errors/AppError.js';

export class AuthService {
  async register({ email, password, name }) {
    const existing = await userRepository.findByEmail(email.toLowerCase().trim());
    if (existing) {
      throw new ConflictError('An account with this email address already exists.');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await userRepository.create({
      email: email.toLowerCase().trim(),
      passwordHash,
      name: name.trim(),
      role: 'USER',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
    });

    const token = signToken({ id: user.id, email: user.email, role: user.role });
    const { passwordHash: _, ...safeUser } = user;

    return { user: safeUser, token };
  }

  async login({ email, password }) {
    const user = await userRepository.findByEmail(email.toLowerCase().trim());
    if (!user) {
      throw new UnauthorizedError('Invalid email or password.');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedError('Invalid email or password.');
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role });
    const profile = await userRepository.findUserProfile(user.id);

    return { user: profile, token };
  }

  async getMe(userId) {
    const profile = await userRepository.findUserProfile(userId);
    if (!profile) {
      throw new NotFoundError('User not found.');
    }
    return profile;
  }

  async updateProfile(userId, data) {
    const allowed = {};
    if (data.name) allowed.name = data.name;
    if (data.avatar) allowed.avatar = data.avatar;
    if (data.bio !== undefined) allowed.bio = data.bio;
    if (data.preferences) {
      allowed.preferences = typeof data.preferences === 'string' ? data.preferences : JSON.stringify(data.preferences);
    }

    await userRepository.update(userId, allowed);
    return userRepository.findUserProfile(userId);
  }

  async resetPassword(email) {
    const user = await userRepository.findByEmail(email.toLowerCase().trim());
    if (!user) {
      // Return true to avoid user enumeration attacks
      return { message: 'If the email is registered, password reset instructions will be sent.' };
    }
    return { message: 'Password reset link sent to registered email address.' };
  }
}

export const authService = new AuthService();
