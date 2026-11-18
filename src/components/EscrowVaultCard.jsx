import React from 'react';

export default function EscrowVaultCard({ project, milestones, activeRole, onOpenAddFreelancerModal }) {
  if (!project) return null;

  const totalBudget = project.totalBudget || 0;
  const lockedBalance = project.escrowVaultBalance || 0;
  const releasedPayout = project.releasedPayout || 0;

  const approvedCount = milestones.filter(m => m.status === 'approved').length;
  const progressPercent = (approvedCount / 4) * 100;

  return (
    <div className="bg-white border border-zinc-200 rounded-md p-6 mb-6 shadow-none">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 mb-5 border-b border-zinc-100">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-semibold tracking-tight text-zinc-950">
              {project.title}
            </h2>
            <div className="inline-flex items-center gap-1.5 text-xs text-zinc-600 bg-zinc-50 border border-zinc-200 px-2 py-0.5 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Active Vault</span>
            </div>
          </div>
          <p className="text-xs text-zinc-500 mt-1 max-w-2xl">
            {project.description}
          </p>
        </div>

        {/* Counterparties & Assign Action */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2.5 text-xs text-zinc-600 border border-zinc-200 rounded px-3 py-1.5 bg-zinc-50">
            <div>
              <span className="text-zinc-400">Client:</span>{' '}
              <span className="text-zinc-950 font-medium">{project.clientName}</span>
            </div>
            <span className="text-zinc-300">/</span>
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-400">Freelancer:</span>{' '}
              <span className="text-zinc-950 font-medium">{project.freelancerName}</span>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-mono ml-0.5">
                <span className="w-1 h-1 rounded-full bg-emerald-500" />
                Verified
              </span>
            </div>
          </div>

          {activeRole === 'client' && (
            <button
              onClick={onOpenAddFreelancerModal}
              className="h-7 px-2.5 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 rounded hover:bg-zinc-50 transition-colors"
            >
              Assign Freelancer
            </button>
          )}
        </div>
      </div>

      {/* Metric Row: Identical white/zinc surfaces with 1px borders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {/* Total Budget */}
        <div className="bg-white border border-zinc-200 rounded-md p-4 shadow-none">
          <div className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-1">
            TOTAL PROJECT BUDGET
          </div>
          <div className="text-2xl font-mono tabular-nums tracking-tight font-semibold text-zinc-950">
            ${totalBudget.toLocaleString()} USD
          </div>
          <div className="text-[11px] text-zinc-400 mt-1 font-mono">
            Committed upfront
          </div>
        </div>

        {/* Vault Locked Balance */}
        <div className="bg-white border border-zinc-200 rounded-md p-4 shadow-none">
          <div className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-1">
            ESCROW VAULT BALANCE
          </div>
          <div className="text-2xl font-mono tabular-nums tracking-tight font-semibold text-zinc-950">
            ${lockedBalance.toLocaleString()} USD
          </div>
          <div className="text-[11px] text-zinc-400 mt-1 font-mono">
            Held in serverless vault
          </div>
        </div>

        {/* Released Payout */}
        <div className="bg-white border border-zinc-200 rounded-md p-4 shadow-none">
          <div className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-1">
            RELEASED PAYOUT
          </div>
          <div className="text-2xl font-mono tabular-nums tracking-tight font-semibold text-zinc-950">
            ${releasedPayout.toLocaleString()} USD
          </div>
          <div className="text-[11px] text-zinc-500 mt-1 font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {approvedCount} of 4 milestones released
          </div>
        </div>
      </div>

      {/* Automated 4-Tier Milestone Progress Bar */}
      <div>
        <div className="flex justify-between items-center text-xs text-zinc-500 mb-2 font-mono">
          <span className="tracking-wider uppercase text-[11px]">Milestone Disbursement</span>
          <span className="font-semibold text-zinc-950 tabular-nums">{progressPercent}% Released</span>
        </div>

        <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-zinc-900 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* 4 Milestone Tier Boxes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {milestones.map((m) => {
            const isApproved = m.status === 'approved';
            const isInProgress = m.status === 'in_progress';
            const isActiveOrDone = isApproved || isInProgress;

            return (
              <div
                key={m.id}
                className={`bg-white rounded-md p-3 transition-colors ${
                  isActiveOrDone ? 'border-2 border-zinc-900' : 'border border-zinc-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
                    Tier {m.tier} (25%)
                  </span>
                  {isApproved && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-mono">
                      <span className="w-1 h-1 rounded-full bg-emerald-500" />
                      Paid
                    </span>
                  )}
                  {isInProgress && (
                    <span className="text-[10px] text-zinc-900 font-mono">
                      Active
                    </span>
                  )}
                  {m.status === 'under_review' && (
                    <span className="text-[10px] text-zinc-500 font-mono">
                      Review
                    </span>
                  )}
                  {m.status === 'locked' && (
                    <span className="text-[10px] text-zinc-400 font-mono">
                      Locked
                    </span>
                  )}
                </div>
                <div className="text-base font-mono tabular-nums font-semibold text-zinc-950">
                  ${m.amount.toLocaleString()} USD
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
