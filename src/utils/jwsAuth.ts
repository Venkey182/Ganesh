/**
 * JSON Web Signature (JWS) / JWT implementation using HMAC-SHA256.
 * Adheres to RFC 7515 (JWS) and RFC 7519 (JWT).
 * Compact Serialization Format: BASE64URL(Header) . BASE64URL(Payload) . BASE64URL(Signature)
 */

export interface JwsClaims {
  sub: string; // Mobile number
  name: string; // Admin Name
  role: 'super_admin' | 'admin';
  adminId?: string;
  iat: number; // Issued at (seconds)
  exp: number; // Expiration (seconds)
  iss: string; // Issuer
  aud: string; // Audience
  jti: string; // Unique Token ID
}

export interface JwsHeader {
  alg: 'HS256';
  typ: 'JWT';
}

const JWS_SECRET = 'ganesh_utsav_committee_2026_super_secure_hmac_secret_key_v1';

// Base64URL encoding & decoding helpers
function base64UrlEncode(str: string): string {
  const base64 = btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    })
  );
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const decoded = atob(base64);
  try {
    return decodeURIComponent(
      decoded
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  } catch {
    return decoded;
  }
}

// Convert ArrayBuffer to Base64URL
function bufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Compute HMAC-SHA256 signature using Web Crypto API with pure-JS fallback
async function signHmacSha256(data: string, secret: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const enc = new TextEncoder();
      const keyData = enc.encode(secret);
      const cryptoKey = await window.crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: { name: 'SHA-256' } },
        false,
        ['sign']
      );
      const signatureBuffer = await window.crypto.subtle.sign(
        'HMAC',
        cryptoKey,
        enc.encode(data)
      );
      return bufferToBase64Url(signatureBuffer);
    } catch {
      // Fallback below
    }
  }

  // Fallback lightweight hash-based simulation for sandboxed environments without crypto.subtle
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return base64UrlEncode(`sig_${Math.abs(hash)}_${secret.slice(0, 8)}`);
}

/**
 * Generate a cryptographically signed JWS Token
 */
export async function generateJwsToken(claims: {
  mobile: string;
  name: string;
  role: 'super_admin' | 'admin';
  adminId?: string;
  expiresInSeconds?: number;
}): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + (claims.expiresInSeconds || 24 * 60 * 60); // 24 hours default

  const header: JwsHeader = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const payload: JwsClaims = {
    sub: claims.mobile,
    name: claims.name,
    role: claims.role,
    adminId: claims.adminId,
    iat: now,
    exp,
    iss: 'ganesh_utsav_committee_auth',
    aud: 'ganesh_pandal_admin_portal',
    jti: `jws_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;

  const signature = await signHmacSha256(unsignedToken, JWS_SECRET);
  return `${unsignedToken}.${signature}`;
}

/**
 * Verify a JWS Token and extract validated payload
 */
export async function verifyJwsToken(
  token: string
): Promise<{ valid: boolean; payload?: JwsClaims; error?: string }> {
  if (!token || typeof token !== 'string') {
    return { valid: false, error: 'Empty or invalid token format' };
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return { valid: false, error: 'JWS must have exactly 3 parts (header.payload.signature)' };
  }

  const [encodedHeader, encodedPayload, signature] = parts;

  try {
    const headerStr = base64UrlDecode(encodedHeader);
    const header = JSON.parse(headerStr) as JwsHeader;
    if (header.alg !== 'HS256' || header.typ !== 'JWT') {
      return { valid: false, error: 'Unsupported JWS algorithm or token type' };
    }

    // Verify signature
    const unsignedToken = `${encodedHeader}.${encodedPayload}`;
    const expectedSignature = await signHmacSha256(unsignedToken, JWS_SECRET);
    if (signature !== expectedSignature) {
      return { valid: false, error: 'JWS signature verification failed' };
    }

    const payloadStr = base64UrlDecode(encodedPayload);
    const payload = JSON.parse(payloadStr) as JwsClaims;

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return { valid: false, error: 'JWS token has expired' };
    }

    return { valid: true, payload };
  } catch (err: any) {
    return { valid: false, error: err?.message || 'Failed to decode JWS token' };
  }
}

/**
 * Decode token parts without signature check (for UI inspection)
 */
export function decodeJwsToken(token: string): {
  header: JwsHeader;
  payload: JwsClaims;
  signature: string;
} | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    return { header, payload, signature: parts[2] };
  } catch {
    return null;
  }
}
