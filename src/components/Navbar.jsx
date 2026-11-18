import React from 'react';

export default function Navbar({ currentUser, activeRole, setActiveRole, onOpenAuthModal, onSignOut, onOpenCreateModal }) {
  return (
    <header className="w-full border-b border-zinc-200 bg-white">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded bg-zinc-950 flex items-center justify-center text-white font-mono text-xs font-semibold">
            H
          </div>
          <span className="font-semibold text-sm tracking-tight text-zinc-950">
            HoldPay
          </span>
          <span className="text-zinc-300 text-xs">/</span>
          <span className="text-xs text-zinc-500 font-normal">
            Escrow Bridge
          </span>
        </div>

        {/* Action Controls & Role Switcher */}
        <div className="flex items-center gap-3">
          
          {/* Segmented Control Role Switcher */}
          <div className="bg-zinc-100 p-0.5 rounded-md flex items-center">
            <button
              onClick={() => setActiveRole('client')}
              className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                activeRole === 'client'
                  ? 'bg-white text-zinc-950 border border-zinc-200/80 shadow-none'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Client
            </button>
            <button
              onClick={() => setActiveRole('freelancer')}
              className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                activeRole === 'freelancer'
                  ? 'bg-white text-zinc-950 border border-zinc-200/80 shadow-none'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Freelancer
            </button>
          </div>

          {/* New Project Button */}
          <button
            onClick={onOpenCreateModal}
            className="h-8 px-3 text-xs font-medium text-zinc-900 bg-white border border-zinc-200 rounded hover:bg-zinc-50 transition-colors"
          >
            New Project
          </button>

          {/* Auth Button / Profile Badge */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <div className="h-8 px-2.5 flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded text-xs text-zinc-900 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>{currentUser.name}</span>
                <span className="text-[10px] text-zinc-400 uppercase font-mono tracking-wider">
                  {currentUser.role}
                </span>
              </div>
              <button
                onClick={onSignOut}
                className="h-8 px-2 text-xs text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="h-8 px-3 text-xs font-medium text-white bg-zinc-900 rounded hover:bg-zinc-800 transition-colors"
            >
              Sign In / Register
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
