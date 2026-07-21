import React from 'react';
import { Lock, ShieldCheck, CheckCircle2, DollarSign, ArrowUpRight, UserPlus, UserCheck } from 'lucide-react';

export default function EscrowVaultCard({ project, milestones, activeRole, onOpenAddFreelancerModal }) {
  if (!project) return null;

  const totalBudget = project.totalBudget || 0;
  const lockedBalance = project.escrowVaultBalance || 0;
  const releasedPayout = project.releasedPayout || 0;

  const approvedCount = milestones.filter(m => m.status === 'approved').length;
  const progressPercent = (approvedCount / 4) * 100;

  return (
    <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
      
      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{project.title}</h2>
            <span style={{ 
              background: 'rgba(6, 182, 212, 0.15)', 
              color: '#38BDF8', 
              fontSize: '0.72rem', 
              padding: '3px 10px', 
              borderRadius: '12px', 
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <ShieldCheck size={13} /> Active Escrow Vault
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '650px' }}>
            {project.description}
          </p>
        </div>

        {/* Parties involved & Add Freelancer Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div className="glass-panel" style={{ padding: '10px 16px', fontSize: '0.8rem' }}>
            <div style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Client: <span style={{ color: '#F8FAFC', fontWeight: 600 }}>{project.clientName}</span>
            </div>
            <div style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Freelancer: 
              <span style={{ color: '#C084FC', fontWeight: 600 }}>{project.freelancerName}</span>
              {project.freelancerEmail && (
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>({project.freelancerEmail})</span>
              )}
              <span style={{ fontSize: '0.65rem', background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', padding: '1px 6px', borderRadius: '8px', fontWeight: 700 }}>
                VERIFIED
              </span>
            </div>
          </div>

          {activeRole === 'client' && (
            <button 
              className="btn-secondary"
              onClick={onOpenAddFreelancerModal}
              style={{ background: 'rgba(139, 92, 246, 0.15)', borderColor: 'rgba(139, 92, 246, 0.4)', color: '#C084FC', padding: '8px 14px', fontSize: '0.82rem' }}
            >
              <UserPlus size={15} /> + Add / Change Freelancer
            </button>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
        gap: '16px', 
        marginBottom: '24px' 
      }}>
        {/* Total Budget */}
        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '6px' }}>
            <span>TOTAL PROJECT BUDGET</span>
            <DollarSign size={16} color="#06B6D4" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800 }} className="gradient-text-cyan">
            ${totalBudget.toLocaleString()} USD
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Locked upfront before kickoff
          </div>
        </div>

        {/* Vault Locked Balance */}
        <div className="glass-panel" style={{ padding: '16px', borderLeft: '3px solid #06B6D4' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '6px' }}>
            <span>ESCROW VAULT BALANCE</span>
            <Lock size={16} color="#38BDF8" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38BDF8' }}>
            ${lockedBalance.toLocaleString()} USD
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Protected in serverless vault
          </div>
        </div>

        {/* Released Payout */}
        <div className="glass-panel" style={{ padding: '16px', borderLeft: '3px solid #10B981' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '6px' }}>
            <span>RELEASED PAYOUT</span>
            <ArrowUpRight size={16} color="#10B981" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800 }} className="gradient-text-emerald">
            ${releasedPayout.toLocaleString()} USD
          </div>
          <div style={{ fontSize: '0.75rem', color: '#34D399', marginTop: '4px' }}>
            {approvedCount} / 4 Milestones Verified
          </div>
        </div>
      </div>

      {/* 4-Tier Milestone Progress Bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          <span>AUTOMATED 4-TIER MILESTONE PROGRESS (25% EACH)</span>
          <span style={{ fontWeight: 700, color: '#F8FAFC' }}>{progressPercent}% RELEASED</span>
        </div>

        {/* Progress Bar background */}
        <div style={{ height: '10px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '6px', overflow: 'hidden', position: 'relative', marginBottom: '16px' }}>
          <div style={{ 
            height: '100%', 
            width: `${progressPercent}%`, 
            background: 'linear-gradient(90deg, #06B6D4 0%, #10B981 100%)',
            transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 0 12px rgba(16, 185, 129, 0.5)'
          }} />
        </div>

        {/* Milestone Tier Nodes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
          {milestones.map((m) => {
            const isApproved = m.status === 'approved';
            const isReview = m.status === 'under_review';
            const isInProgress = m.status === 'in_progress';
            
            let color = 'var(--text-muted)';
            let bg = 'rgba(255, 255, 255, 0.04)';
            let border = 'rgba(255, 255, 255, 0.08)';

            if (isApproved) {
              color = '#34D399';
              bg = 'rgba(16, 185, 129, 0.1)';
              border = 'rgba(16, 185, 129, 0.3)';
            } else if (isReview) {
              color = '#F59E0B';
              bg = 'rgba(245, 158, 11, 0.1)';
              border = 'rgba(245, 158, 11, 0.4)';
            } else if (isInProgress) {
              color = '#38BDF8';
              bg = 'rgba(6, 182, 212, 0.1)';
              border = 'rgba(6, 182, 212, 0.4)';
            }

            return (
              <div key={m.id} style={{ 
                background: bg, 
                border: `1px solid ${border}`, 
                borderRadius: '8px', 
                padding: '8px 12px',
                textAlign: 'center',
                transition: 'all 0.2s ease'
              }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color, textTransform: 'uppercase', marginBottom: '2px' }}>
                  Tier {m.tier} (25%)
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#F8FAFC' }}>
                  ${m.amount.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
