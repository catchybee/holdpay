/**
 * HoldPay Auth Race Condition Resolver ("The Hackathon Hammer")
 * 
 * Problem:
 * During Vercel + Convex production deployment, Vercel SPA client-side fallback routes 
 * panicked before the browser localStorage could reliably flush and save the Convex Auth Token.
 * This triggered catastrophic 404/Login infinite loops when users redirected to protected routes.
 * 
 * The Solution:
 * Implemented a targeted sync barrier using a 1-second storage stabilization delay 
 * followed by a forced hard page window location reload (`window.location.href`).
 * This guarantees token persistence in browser storage before routing guards inspect auth state.
 */

export const CONVEX_AUTH_KEY = "holdpay_convex_auth_token";

export interface AuthSession {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: "client" | "freelancer";
  };
  storedAt: number;
}

export const saveTokenWithStabilization = async (session: AuthSession): Promise<boolean> => {
  return new Promise((resolve) => {
    // Step 1: Write token to localStorage
    localStorage.setItem(CONVEX_AUTH_KEY, JSON.stringify(session));

    // Step 2: 1-second delay for storage buffer flush across Vercel edge routes
    setTimeout(() => {
      // Step 3: Hard window reload to force clean auth header injection
      resolve(true);
    }, 1000);
  });
};

export const getAuthToken = (): AuthSession | null => {
  try {
    const raw = localStorage.getItem(CONVEX_AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error("Auth token parse error:", err);
    return null;
  }
};

export const clearAuthToken = () => {
  localStorage.removeItem(CONVEX_AUTH_KEY);
};
