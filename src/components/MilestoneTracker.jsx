import React, { useState } from 'react';

export default function MilestoneTracker({ milestones, activeRole, onSubmitWork, onApproveAndPay }) {
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [proofUrl, setProofUrl] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');

  const handleOpenSubmitModal = (m) => {
    setSelectedMilestone(m);
    setProofUrl(m.proofLink || 'https://github.com/team-hackdot/holdpay-demo');
    setSubmissionNotes(m.submissionNotes || 'Deliverables completed as specified.');
  };

  const handleConfirmSubmission = (e) => {
    e.preventDefault();
    if (!selectedMilestone) return;
    onSubmitWork(selectedMilestone.id, proofUrl, submissionNotes);
    setSelectedMilestone(null);
  };

  return (
    <div className="mb-10">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-zinc-950">
            Automated 4-Tier Milestones
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Budget is split into 4 equal 25% payouts released upon client approval.
          </p>
        </div>

        {/* Current View Badge in cool slate/indigo tint */}
        <div className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded text-xs font-mono">
          <span className="text-slate-400">Current View:</span>
          <span className="font-semibold text-slate-900 uppercase">
            {activeRole}
          </span>
        </div>
      </div>

      {/* List of 4 Milestones */}
      <div className="flex flex-col gap-2.5">
        {milestones.map((m) => {
          const isLocked = m.status === 'locked';
          const isInProgress = m.status === 'in_progress';
          const isReview = m.status === 'under_review';
          const isApproved = m.status === 'approved';

          // Differentiated Tier States
          let cardStyles = 'bg-white border border-zinc-200 rounded-md p-4 transition-all';
          if (isApproved) {
            cardStyles = 'bg-emerald-50/20 border border-emerald-200 rounded-md p-4 transition-all';
          } else if (isInProgress) {
            cardStyles = 'bg-white border border-indigo-600 ring-2 ring-indigo-600/10 rounded-md p-4 transition-all';
          } else if (isReview) {
            cardStyles = 'bg-amber-50/20 border border-amber-200 rounded-md p-4 transition-all';
          } else if (isLocked) {
            cardStyles = 'bg-zinc-50/70 border border-dashed border-zinc-200 text-zinc-400 rounded-md p-4 transition-all';
          }

          return (
            <div key={m.id} className={cardStyles}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                {/* Left Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-[11px] font-mono uppercase tracking-wider ${isLocked ? 'text-zinc-400' : 'text-zinc-500'}`}>
                      Tier {m.tier} of 4 (25%)
                    </span>

                    {/* Differentiated Status Soft Pills */}
                    {isApproved && (
                      <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-50/80 text-emerald-700 border border-emerald-200/60 px-2 py-0.5 rounded font-mono font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Approved & Paid
                      </span>
                    )}
                    {isInProgress && (
                      <span className="inline-flex items-center gap-1 text-[11px] bg-indigo-50 text-indigo-700 border border-indigo-200/60 px-2 py-0.5 rounded font-mono font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                        Work in Progress
                      </span>
                    )}
                    {isReview && (
                      <span className="inline-flex items-center gap-1 text-[11px] bg-amber-50 text-amber-700 border border-amber-200/60 px-2 py-0.5 rounded font-mono font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        Under Client Review
                      </span>
                    )}
                    {isLocked && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-zinc-400 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
                        Locked in Vault
                      </span>
                    )}
                  </div>

                  <h4 className={`text-sm font-semibold ${isLocked ? 'text-zinc-400' : 'text-zinc-950'}`}>
                    {m.title}
                  </h4>
                  <p className={`text-xs mt-0.5 ${isLocked ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    {m.description}
                  </p>

                  {/* Proof Deliverable Container: Crisp slate code-style container */}
                  {(isReview || isApproved) && m.proofLink && (
                    <div className="mt-2.5 p-2.5 bg-slate-50 border border-slate-200/80 rounded text-xs">
                      <div className="text-[11px] text-slate-500 font-mono mb-1">
                        Proof Deliverable:
                      </div>
                      <a 
                        href={m.proofLink} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-xs font-mono text-indigo-600 hover:underline font-medium truncate block"
                      >
                        {m.proofLink}
                      </a>
                      {m.submissionNotes && (
                        <div className="text-xs text-slate-600 mt-1 italic">
                          "{m.submissionNotes}"
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Right Amount & Actions */}
                <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 sm:gap-2 shrink-0">
                  <div className="text-right">
                    <div className={`text-base font-mono tabular-nums font-semibold ${isLocked ? 'text-zinc-400' : 'text-zinc-900'}`}>
                      ${m.amount.toLocaleString()} USD
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div>
                    {activeRole === 'freelancer' && (isInProgress || isReview) && !isApproved && (
                      <button 
                        onClick={() => handleOpenSubmitModal(m)}
                        className="h-7 px-3 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded shadow-sm transition-colors"
                      >
                        {isReview ? 'Update Proof' : 'Submit Proof'}
                      </button>
                    )}

                    {activeRole === 'client' && isReview && (
                      <button 
                        onClick={() => onApproveAndPay(m.id)}
                        className="h-7 px-3 text-xs font-medium text-white bg-zinc-900 rounded hover:bg-zinc-800 transition-colors"
                      >
                        Approve & Pay
                      </button>
                    )}

                    {activeRole === 'client' && isInProgress && (
                      <span className="text-[11px] text-zinc-400 font-mono">
                        Awaiting submission
                      </span>
                    )}

                    {activeRole === 'freelancer' && isLocked && (
                      <span className="text-[11px] text-zinc-400 font-mono">
                        Locked
                      </span>
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
          <div className="modal-content-minimal">
            <h3 className="text-sm font-semibold tracking-tight text-zinc-950 mb-1">
              Submit Milestone {selectedMilestone.tier} Deliverables
            </h3>
            <p className="text-xs text-zinc-500 mb-4">
              Enter the link to deliverables (GitHub pull request, prototype, deployment) for verification.
            </p>

            <form onSubmit={handleConfirmSubmission}>
              <div className="mb-3">
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Deliverable URL
                </label>
                <input 
                  type="url" 
                  required
                  value={proofUrl} 
                  onChange={(e) => setProofUrl(e.target.value)}
                  placeholder="https://github.com/..." 
                  className="w-full text-xs font-mono text-indigo-600" 
                />
              </div>

              <div className="mb-4">
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Submission Notes
                </label>
                <textarea 
                  rows={3}
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  placeholder="Summary of completed milestone work..."
                  className="w-full text-xs resize-none" 
                />
              </div>

              <div className="flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setSelectedMilestone(null)}
                  className="h-8 px-3 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 rounded hover:bg-zinc-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="h-8 px-3 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded shadow-sm transition-colors"
                >
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
