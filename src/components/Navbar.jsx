import React from 'react';
import { ShieldCheck, Lock, UserCheck, PlusCircle, Zap, LogIn, LogOut, User } from 'lucide-react';

export default function Navbar({ currentUser, activeRole, setActiveRole, onOpenAuthModal, onSignOut, onOpenCreateModal }) {
  return (
    <header className="glass-card" style={{ borderRadius: '0 0 20px 20px', borderTop: 'none', padding: '16px 28px', marginBottom: '28px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ 
            width: '42px', 
            height: '42px', 
            borderRadius: '12px', 
            background: 'linear-gradient(135deg, #06B6D4 0%, #8B5CF6 100%)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)'
          }}>
            <Lock size={22} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }} className="gradient-text-cyan">
                HoldPay
              </h1>
              <span style={{ 
                fontSize: '0.65rem', 
                background: 'rgba(16, 185, 129, 0.15)', 
                color: '#34D399', 
                border: '1px solid rgba(16, 185, 129, 0.3)', 
                padding: '2px 8px', 
                borderRadius: '12px', 
                fontWeight: 700 
              }}>
                CONVEX AUTH READY
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
              Zero-Friction Freelance Escrow Vault • Powered by Convex Auth & Stripe
            </p>
          </div>
        </div>

        {/* Action Controls & Auth User Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          
          {/* Role Toggle */}
          <div className="glass-panel" style={{ padding: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              onClick={() => setActiveRole('client')}
              style={{
                background: activeRole === 'client' ? 'linear-gradient(135deg, #06B6D4 0%, #0284C7 100%)' : 'transparent',
                color: activeRole === 'client' ? '#FFF' : 'var(--text-secondary)',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <UserCheck size={14} /> Client View
            </button>
            <button
              onClick={() => setActiveRole('freelancer')}
              style={{
                background: activeRole === 'freelancer' ? 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)' : 'transparent',
                color: activeRole === 'freelancer' ? '#FFF' : 'var(--text-secondary)',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Zap size={14} /> Freelancer View
            </button>
          </div>

          {/* New Project Button */}
          <button className="btn-primary" onClick={onOpenCreateModal} style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
            <PlusCircle size={16} /> New Escrow Project
          </button>

          {/* Auth Button / Profile Badge */}
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="glass-panel" style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: currentUser.role === 'client' ? '#06B6D4' : '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem', color: '#FFF' }}>
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FFF' }}>{currentUser.name}</div>
                  <div style={{ fontSize: '0.68rem', color: currentUser.role === 'client' ? '#38BDF8' : '#C084FC', textTransform: 'uppercase', fontWeight: 700 }}>
                    {currentUser.role}
                  </div>
                </div>
              </div>

              <button className="btn-secondary" onClick={onSignOut} style={{ padding: '8px 12px', fontSize: '0.78rem' }}>
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          ) : (
            <button className="btn-emerald" onClick={onOpenAuthModal} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              <LogIn size={16} /> Sign In / Register
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
