import React, { useState } from 'react';
import { CheckCircle2, Clock, Lock, Send, ExternalLink, Zap, ShieldCheck, AlertCircle } from 'lucide-react';

export default function MilestoneTracker({ milestones, activeRole, onSubmitWork, onApproveAndPay }) {
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [proofUrl, setProofUrl] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');

  const handleOpenSubmitModal = (m) => {
    setSelectedMilestone(m);
    setProofUrl(m.proofLink || 'https://github.com/team-hackdot/holdpay-demo');
    setSubmissionNotes(m.submissionNotes || 'Completed milestone deliverables as specified in project contract.');
  };

  const handleConfirmSubmission = (e) => {
    e.preventDefault();
    if (!selectedMilestone) return;
    onSubmitWork(selectedMilestone.id, proofUrl, submissionNotes);
    setSelectedMilestone(null);
  };

  return (
    <div style={{ marginBottom: '32px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Strict 4-Tier Milestone Logic</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Funds are locked in escrow upfront and released in 4 equal 25% increments upon client approval.
          </p>
        </div>

        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          Role: 
          {activeRole === 'client' ? (
            <span className="role-badge-client">Client (Approver)</span>
          ) : (
            <span className="role-badge-freelancer">Freelancer (Submitter)</span>
          )}
        </div>
      </div>

      {/* List of 4 Milestones */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {milestones.map((m) => {
          const isLocked = m.status === 'locked';
          const isInProgress = m.status === 'in_progress';
          const isReview = m.status === 'under_review';
          const isApproved = m.status === 'approved';

          return (
            <div 
              key={m.id} 
              className="glass-card" 
              style={{ 
                padding: '20px', 
                borderLeft: isApproved 
                  ? '4px solid #059669' 
                  : isReview 
                  ? '4px solid #D97706' 
                  : isInProgress 
                  ? '4px solid #C28E4E' 
                  : '4px solid rgba(195, 180, 160, 0.4)',
                opacity: isLocked ? 0.75 : 1
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                
                {/* Left info */}
                <div style={{ flex: '1 1 300px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{ 
                      fontSize: '0.72rem', 
                      background: 'rgba(195, 180, 160, 0.25)', 
                      padding: '2px 8px', 
                      borderRadius: '6px', 
                      fontWeight: 700,
                      color: 'var(--text-secondary)'
                    }}>
                      MILESTONE {m.tier} OF 4
                    </span>

                    {/* Status Badges */}
                    {isApproved && (
                      <span style={{ color: '#059669', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={14} /> APPROVED & PAID (25%)
                      </span>
                    )}
                    {isReview && (
                      <span style={{ color: '#D97706', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={14} /> UNDER CLIENT REVIEW
                      </span>
                    )}
                    {isInProgress && (
                      <span style={{ color: '#925C1A', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Zap size={14} /> WORK IN PROGRESS
                      </span>
                    )}
                    {isLocked && (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Lock size={14} /> LOCKED IN VAULT
                      </span>
                    )}
                  </div>

                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '4px' }}>{m.title}</h4>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>{m.description}</p>

                  {/* Submission details if under review or approved */}
                  {(isReview || isApproved) && m.proofLink && (
                    <div style={{ marginTop: '10px', background: 'rgba(244, 238, 229, 0.75)', border: '1px solid rgba(195, 180, 160, 0.35)', padding: '8px 12px', borderRadius: '8px', fontSize: '0.78rem' }}>
                      <div style={{ color: 'var(--text-muted)', marginBottom: '2px' }}>Submitted Proof of Work:</div>
                      <a href={m.proofLink} target="_blank" rel="noreferrer" style={{ color: '#925C1A', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                        {m.proofLink} <ExternalLink size={12} />
                      </a>
                      {m.submissionNotes && (
                        <div style={{ color: 'var(--text-secondary)', marginTop: '4px', fontStyle: 'italic' }}>
                          "{m.submissionNotes}"
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Right Amount & Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>25% Milestone Payout</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: isApproved ? '#059669' : 'var(--text-primary)' }}>
                      ${m.amount.toLocaleString()} USD
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div>
                    {/* Freelancer Action: Submit Work */}
                    {activeRole === 'freelancer' && (isInProgress || isReview) && !isApproved && (
                      <button 
                        className="btn-secondary" 
                        onClick={() => handleOpenSubmitModal(m)}
                        style={{ background: 'rgba(168, 92, 60, 0.1)', borderColor: 'rgba(168, 92, 60, 0.3)', color: '#A85C3C' }}
                      >
                        <Send size={15} /> {isReview ? 'Update Work Proof' : 'Submit Deliverable'}
                      </button>
                    )}

                    {/* Client Action: One-Click Approve & Pay */}
                    {activeRole === 'client' && isReview && (
                      <button 
                        className="btn-emerald"
                        onClick={() => onApproveAndPay(m.id)}
                      >
                        <Zap size={16} /> One-Click Approve & Pay
                      </button>
                    )}

                    {/* Role helper hint if client looks at in-progress or locked */}
                    {activeRole === 'client' && isInProgress && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', maxWidth: '140px' }}>
                        Waiting for freelancer submission
                      </div>
                    )}
                    {activeRole === 'freelancer' && isLocked && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', maxWidth: '140px' }}>
                        Unlocks after previous tier completion
                      </div>
                    )}
                  </div>

                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Freelancer Submitting Work */}
      {selectedMilestone && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>
              Submit Milestone {selectedMilestone.tier} Deliverable
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
              Provide proof of work (GitHub repo, Figma prototype, staging URL) for client verification.
            </p>

            <form onSubmit={handleConfirmSubmission}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Proof of Work URL
                </label>
                <input 
                  type="url" 
                  required
                  value={proofUrl} 
                  onChange={(e) => setProofUrl(e.target.value)}
                  placeholder="https://github.com/..." 
                  style={{ 
                    width: '100%', 
                    padding: '10px 14px', 
                    borderRadius: '8px', 
                    fontSize: '0.9rem' 
                  }} 
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Submission Notes
                </label>
                <textarea 
                  rows={3}
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  placeholder="Summary of completed features..."
                  style={{ 
                    width: '100%', 
                    padding: '10px 14px', 
                    borderRadius: '8px', 
                    fontSize: '0.9rem',
                    resize: 'none'
                  }} 
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn-secondary" onClick={() => setSelectedMilestone(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Submit to Client for Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
