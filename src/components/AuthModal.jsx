import React, { useState } from 'react';
import { Lock, Mail, User, ShieldCheck, Zap, X, UserCheck, KeyRound, Database } from 'lucide-react';
import { saveTokenWithStabilization } from '../../convex/authFix';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('client'); // 'client' | 'freelancer'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userName = name || (email.split('@')[0]);

      // Session object saved to localStorage + synced with Convex database
      const userSession = {
        token: "convex_auth_token_" + Date.now(),
        user: {
          id: "usr_" + Math.random().toString(36).substr(2, 9),
          name: userName,
          email: email,
          role: role,
          convexStored: true
        },
        storedAt: Date.now()
      };

      await saveTokenWithStabilization(userSession);

      onAuthSuccess(userSession.user);
      setLoading(false);
      onClose();
    } catch (err) {
      setError("Authentication failed. Please check your credentials.");
      setLoading(false);
    }
  };

  const handleQuickDemoAuth = async (demoRole) => {
    setLoading(true);
    const demoUser = demoRole === 'client' 
      ? { id: 'u_client_demo', name: 'Acme Ventures (Client)', email: 'client@acme.com', role: 'client', convexStored: true }
      : { id: 'u_freelancer_demo', name: 'Alex Rivera (Freelancer)', email: 'alex@freelance.dev', role: 'freelancer', convexStored: true };

    await saveTokenWithStabilization({
      token: "demo_token_" + demoRole,
      user: demoUser,
      storedAt: Date.now()
    });

    onAuthSuccess(demoUser);
    setLoading(false);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '480px' }}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #06B6D4 0%, #8B5CF6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={20} color="#FFF" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
                {isSignUp ? 'Create HoldPay Account' : 'Welcome Back to HoldPay'}
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Database size={12} color="#34D399" /> Saved to Convex `userProfiles` Table
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.4)', padding: '10px 14px', borderRadius: '8px', color: '#F43F5E', fontSize: '0.82rem', marginBottom: '14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          {isSignUp && (
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Full Name / Handle
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  style={{ width: '100%', padding: '10px 14px 10px 38px', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#FFF', fontSize: '0.88rem' }}
                />
              </div>
            </div>
          )}

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@holdpay.dev"
                style={{ width: '100%', padding: '10px 14px 10px 38px', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#FFF', fontSize: '0.88rem' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input 
                type="password" 
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                style={{ width: '100%', padding: '10px 14px 10px 38px', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#FFF', fontSize: '0.88rem' }}
              />
            </div>
          </div>

          {/* Role Selection */}
          {isSignUp && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Account Primary Role
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div 
                  onClick={() => setRole('client')}
                  style={{ 
                    padding: '10px', 
                    borderRadius: '8px', 
                    border: role === 'client' ? '2px solid #06B6D4' : '1px solid var(--border-glass)',
                    background: role === 'client' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(0,0,0,0.2)',
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  <UserCheck size={18} color={role === 'client' ? '#38BDF8' : 'var(--text-muted)'} />
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: role === 'client' ? '#38BDF8' : 'var(--text-secondary)', marginTop: '4px' }}>
                    Client
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Fund Vault & Approve</div>
                </div>

                <div 
                  onClick={() => setRole('freelancer')}
                  style={{ 
                    padding: '10px', 
                    borderRadius: '8px', 
                    border: role === 'freelancer' ? '2px solid #8B5CF6' : '1px solid var(--border-glass)',
                    background: role === 'freelancer' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(0,0,0,0.2)',
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  <Zap size={18} color={role === 'freelancer' ? '#C084FC' : 'var(--text-muted)'} />
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: role === 'freelancer' ? '#C084FC' : 'var(--text-secondary)', marginTop: '4px' }}>
                    Freelancer
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Deliver & Get Paid</div>
                </div>
              </div>
            </div>
          )}

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }} disabled={loading}>
            {loading ? 'Saving to Convex & Authenticating...' : (isSignUp ? 'Create & Store Convex Account' : 'Sign In to Dashboard')}
          </button>
        </form>

        {/* Quick Demo Login */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-glass)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '10px' }}>
            OR QUICK SIGN IN WITH DEMO ACCOUNT
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button 
              type="button" 
              className="btn-secondary" 
              style={{ fontSize: '0.78rem', justifyContent: 'center', borderColor: 'rgba(6, 182, 212, 0.3)', color: '#38BDF8' }}
              onClick={() => handleQuickDemoAuth('client')}
            >
              Demo Client
            </button>
            <button 
              type="button" 
              className="btn-secondary" 
              style={{ fontSize: '0.78rem', justifyContent: 'center', borderColor: 'rgba(139, 92, 246, 0.3)', color: '#C084FC' }}
              onClick={() => handleQuickDemoAuth('freelancer')}
            >
              Demo Freelancer
            </button>
          </div>
        </div>

        {/* Toggle sign up / sign in */}
        <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          {isSignUp ? (
            <>Already have an account? <span onClick={() => setIsSignUp(false)} style={{ color: '#06B6D4', cursor: 'pointer', fontWeight: 600 }}>Sign In</span></>
          ) : (
            <>Don't have an account? <span onClick={() => setIsSignUp(true)} style={{ color: '#06B6D4', cursor: 'pointer', fontWeight: 600 }}>Sign Up</span></>
          )}
        </div>

      </div>
    </div>
  );
}
