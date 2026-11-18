import React, { useState } from 'react';

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
      <div className="modal-content-minimal">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-zinc-100">
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-zinc-950">
              Create Escrow Project
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Funds will be locked in the escrow vault and split into 4 equal milestones.
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="text-zinc-400 hover:text-zinc-600 text-sm font-mono p-1"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Project Title
            </label>
            <input 
              type="text" 
              required
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Mobile Escrow App Integration"
              className="w-full text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Overview & Deliverables
            </label>
            <textarea 
              rows={2}
              required
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of project specifications..."
              className="w-full text-xs resize-none"
            />
          </div>

          {/* Budget & 4-tier Preview */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Total Budget ($ USD)
              </label>
              <input 
                type="number" 
                min="100"
                step="100"
                required
                value={budget} 
                onChange={(e) => setBudget(e.target.value)}
                className="w-full text-xs font-mono tabular-nums font-semibold"
              />
            </div>

            <div className="p-2.5 bg-zinc-50 border border-zinc-200 rounded">
              <div className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">
                4-Tier Disbursement
              </div>
              <div className="text-sm font-mono tabular-nums font-semibold text-zinc-950 mt-0.5">
                ${milestoneSplit.toLocaleString()} USD / tier
              </div>
            </div>
          </div>

          {/* Client & Freelancer Names */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Client Organization
              </label>
              <input 
                type="text" 
                required
                value={clientName} 
                onChange={(e) => setClientName(e.target.value)}
                className="w-full text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Freelancer Name
              </label>
              <input 
                type="text" 
                required
                value={freelancerName} 
                onChange={(e) => setFreelancerName(e.target.value)}
                className="w-full text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Freelancer Email
            </label>
            <input 
              type="email" 
              required
              value={freelancerEmail} 
              onChange={(e) => setFreelancerEmail(e.target.value)}
              placeholder="freelancer@domain.com"
              className="w-full text-xs"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-zinc-100">
            <button 
              type="button" 
              onClick={onClose}
              className="h-8 px-3 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 rounded hover:bg-zinc-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="h-8 px-3.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded shadow-sm transition-colors"
            >
              Lock Funds & Create
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
