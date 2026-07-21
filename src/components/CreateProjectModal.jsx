import React, { useState } from 'react';
import { Lock, ShieldCheck, DollarSign, Sparkles, X } from 'lucide-react';

export default function CreateProjectModal({ isOpen, onClose, onCreateProject }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState(4000);
  const [clientName, setClientName] = useState('Apex Digital Corp');
  const [freelancerName, setFreelancerName] = useState('Elena Rostova');
  const [freelancerEmail, setFreelancerEmail] = useState('elena@uiux.studio');

  if (!isOpen) return null;

  const milestoneSplit = budget > 0 ? (budget / 4) : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateProject({
      title,
      description,
      totalBudget: Number(budget),
      clientName,
      freelancerName,
      freelancerEmail
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '620px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={18} color="#06B6D4" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Create Zero-Friction Escrow Project</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>Funds are locked upfront via Stripe before work begins</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Project Title
            </label>
            <input 
              type="text" 
              required
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AI-Powered Analytics Dashboard"
              style={{ width: '100%', padding: '10px 14px', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#FFF', fontSize: '0.9rem' }}
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Project Overview / Scope
            </label>
            <textarea 
              rows={2}
              required
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of project deliverables and acceptance criteria..."
              style={{ width: '100%', padding: '10px 14px', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#FFF', fontSize: '0.9rem', resize: 'none' }}
            />
          </div>

          {/* Budget & 4-tier Preview */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Total Budget ($ USD)
              </label>
              <input 
                type="number" 
                min="100"
                step="100"
                required
                value={budget} 
                onChange={(e) => setBudget(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#38BDF8', fontWeight: 700, fontSize: '1.1rem' }}
              />
            </div>

            <div className="glass-panel" style={{ padding: '10px 14px', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>AUTOMATED 4-TIER SPLIT</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34D399' }}>
                ${milestoneSplit.toLocaleString()} / Tier
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>4 equal 25% milestone releases</div>
            </div>
          </div>

          {/* Client & Freelancer Names */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Client Name / Organization
              </label>
              <input 
                type="text" 
                required
                value={clientName} 
                onChange={(e) => setClientName(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#FFF', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Freelancer Name / Handle
              </label>
              <input 
                type="text" 
                required
                value={freelancerName} 
                onChange={(e) => setFreelancerName(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#FFF', fontSize: '0.88rem' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Freelancer Email Address
            </label>
            <input 
              type="email" 
              required
              value={freelancerEmail} 
              onChange={(e) => setFreelancerEmail(e.target.value)}
              placeholder="freelancer@domain.com"
              style={{ width: '100%', padding: '10px 14px', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#FFF', fontSize: '0.88rem' }}
            />
          </div>

          {/* Stripe Escrow Security notice */}
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '10px 14px', borderRadius: '10px', fontSize: '0.78rem', color: '#34D399', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={20} style={{ shrink: 0 }} />
            <div>
              <strong>Stripe Escrow Guarantee:</strong> 100% of the total budget will be verified & locked in HoldPay serverless vault before project status activates.
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-emerald">
              <Sparkles size={16} /> Lock Funds & Launch Escrow
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
