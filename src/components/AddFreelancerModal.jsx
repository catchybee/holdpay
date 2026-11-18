import React, { useState } from 'react';

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
      <div className="modal-content-minimal max-w-md">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-zinc-100">
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-zinc-950">
              Assign Freelancer
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Directly link freelancer to receive 4-tier milestone disbursements.
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
              Freelancer Name
            </label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Rivera"
              className="w-full text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Email Address
            </label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@freelance.dev"
              className="w-full text-xs"
            />
          </div>

          {/* Quick Select Presets */}
          <div>
            <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
              Or Choose Preset
            </label>
            <div className="flex flex-col gap-1.5">
              {PRESETS.map((p, idx) => (
                <div 
                  key={idx}
                  onClick={() => handleSelectPreset(p)}
                  className={`p-2.5 border rounded cursor-pointer transition-colors flex justify-between items-center ${
                    email === p.email 
                      ? 'border-zinc-950 bg-zinc-50' 
                      : 'border-zinc-200 bg-white hover:border-zinc-300'
                  }`}
                >
                  <div>
                    <div className="text-xs font-medium text-zinc-950">{p.name}</div>
                    <div className="text-[11px] text-zinc-500 font-mono">{p.email} • {p.role}</div>
                  </div>
                  {email === p.email && (
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-950" />
                  )}
                </div>
              ))}
            </div>
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
              className="h-8 px-3 text-xs font-medium text-white bg-zinc-900 rounded hover:bg-zinc-800 transition-colors"
            >
              Assign to Escrow
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
