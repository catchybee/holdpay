import React, { useState } from 'react';
import { UserPlus, Mail, User, ShieldCheck, Zap, X, CheckCircle2 } from 'lucide-react';

export default function AddFreelancerModal({ isOpen, onClose, onAssignFreelancer, currentFreelancer }) {
  const [name, setName] = useState(currentFreelancer?.name || '');
  const [email, setEmail] = useState(currentFreelancer?.email || '');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const PRESETS = [
    { name: 'Alex Rivera (Freelancer)', email: 'alex@freelance.dev', role: 'Full-Stack Developer' },
    { name: 'Elena Rostova', email: 'elena@uiux.studio', role: 'Lead Product Designer' },
    { name: 'Marcus Chen', email: 'marcus@cloudsec.io', role: 'Security & Smart Contract Engineer' }
  ];

  const handleSelectPreset = (p) => {
    setName(p.name);
    setEmail(p.email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) return;

    onAssignFreelancer({
      freelancerName: name,
      freelancerEmail: email,
      notes
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '520px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserPlus size={20} color="#C084FC" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Assign Freelancer to Escrow</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
                Directly route 4-tier milestone payouts to verified freelancer
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Freelancer Name / Handle
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

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Freelancer Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="freelancer@domain.com"
                style={{ width: '100%', padding: '10px 14px 10px 38px', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#FFF', fontSize: '0.88rem' }}
              />
            </div>
          </div>

          {/* Quick Select Presets */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
              OR SELECT REGISTERED FREELANCER PRESET
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {PRESETS.map((p, idx) => (
                <div 
                  key={idx}
                  onClick={() => handleSelectPreset(p)}
                  className="glass-panel"
                  style={{ 
                    padding: '8px 12px', 
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    border: email === p.email ? '1px solid #C084FC' : '1px solid rgba(255,255,255,0.05)',
                    background: email === p.email ? 'rgba(139, 92, 246, 0.15)' : 'rgba(0,0,0,0.2)'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#FFF' }}>{p.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{p.email} • {p.role}</div>
                  </div>
                  {email === p.email && <CheckCircle2 size={16} color="#C084FC" />}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)' }}>
              <UserPlus size={16} /> Assign Freelancer to Escrow
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
