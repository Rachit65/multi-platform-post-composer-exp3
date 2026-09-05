// Standard Base64Url Encoder and Decoder for JWT
export function base64UrlEncode(str) {
  const bytes = new TextEncoder().encode(str);
  let binStr = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binStr += String.fromCharCode(bytes[i]);
  }
  return btoa(binStr)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function base64UrlDecode(str) {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binStr = atob(base64);
  const bytes = new Uint8Array(binStr.length);
  for (let i = 0; i < binStr.length; i++) {
    bytes[i] = binStr.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

// Simple hash simulation for signature generation (HMAC-SHA256 mockup)
function generateSignature(headerB64, payloadB64, secret = 'exp3-jwt-secret-key-2026') {
  const data = `${headerB64}.${payloadB64}.${secret}`;
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return base64UrlEncode(`sig_hmac256_${hex}_valid`);
}

// Mock User Database with Roles (Admin & User)
export const INITIAL_USERS = [
  {
    id: 'usr_admin_01',
    name: 'Rachit Saini',
    email: 'admin@composer.com',
    password: 'admin123',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    permissions: ['create_post', 'delete_post', 'manage_users', 'manage_platforms', 'system_config'],
    status: 'active',
    createdAt: '2026-08-01T10:00:00.000Z',
  },
  {
    id: 'usr_regular_02',
    name: 'Alex Johnson',
    email: 'user@composer.com',
    password: 'user123',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
    permissions: ['create_post', 'publish_post', 'view_platforms'],
    status: 'active',
    createdAt: '2026-08-15T12:30:00.000Z',
  },
];

const STORAGE_USERS_KEY = 'jwt_exp3_users_db';
const STORAGE_TOKEN_KEY = 'jwt_exp3_auth_token';

// Local storage helpers for simulated database
export function getStoredUsers() {
  const data = localStorage.getItem(STORAGE_USERS_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_USERS;
  }
}

export function saveStoredUsers(users) {
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
}

export function getStoredToken() {
  return localStorage.getItem(STORAGE_TOKEN_KEY);
}

export function saveStoredToken(token) {
  localStorage.setItem(STORAGE_TOKEN_KEY, token);
}

export function clearStoredToken() {
  localStorage.removeItem(STORAGE_TOKEN_KEY);
}

// Generate JWT token with header, payload (claims), and signature
export function createJWT(user, expiresInSeconds = 3600) {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    permissions: user.permissions,
    iat: now,
    exp: now + expiresInSeconds,
  };

  const headerB64 = base64UrlEncode(JSON.stringify(header));
  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  const signatureB64 = generateSignature(headerB64, payloadB64);

  return `${headerB64}.${payloadB64}.${signatureB64}`;
}

// Decode token into its 3 segments and parsed JSON
export function decodeJWT(token) {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const [headerB64, payloadB64, signatureB64] = parts;
    const header = JSON.parse(base64UrlDecode(headerB64));
    const payload = JSON.parse(base64UrlDecode(payloadB64));

    return {
      raw: {
        header: headerB64,
        payload: payloadB64,
        signature: signatureB64,
      },
      header,
      payload,
      signature: signatureB64,
    };
  } catch (err) {
    console.error('Error decoding JWT:', err);
    return null;
  }
}

// Verify token integrity and expiry
export function verifyJWT(token) {
  const decoded = decodeJWT(token);
  if (!decoded) return { valid: false, reason: 'Malformed token structure' };

  const { header, payload, raw } = decoded;
  const expectedSignature = generateSignature(raw.header, raw.payload);

  if (raw.signature !== expectedSignature) {
    return { valid: false, reason: 'Invalid signature. Token has been tampered with.' };
  }

  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < now) {
    return { valid: false, reason: 'Token expired', expired: true };
  }

  return { valid: true, decoded };
}
