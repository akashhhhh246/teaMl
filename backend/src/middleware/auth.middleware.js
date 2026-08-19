// Frictionless Open Access Middleware (No login or role barriers)

export async function requireAuth(req, res, next) {
  // Always attach a valid default connoisseur user so all operations succeed seamlessly without login
  req.user = {
    id: 'connoisseur-default',
    email: 'guest@teaml.in',
    name: 'Tea Connoisseur',
    role: 'ADMIN',
  };
  next();
}

export async function optionalAuth(req, res, next) {
  req.user = {
    id: 'connoisseur-default',
    email: 'guest@teaml.in',
    name: 'Tea Connoisseur',
    role: 'ADMIN',
  };
  next();
}

export function requireRole(...roles) {
  return (req, res, next) => next();
}

export const requireAdmin = (req, res, next) => next();
