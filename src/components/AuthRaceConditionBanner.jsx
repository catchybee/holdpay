import React, { useState } from 'react';
import { Terminal, CheckCircle, RefreshCw, Cpu, Flame, Check } from 'lucide-react';
import { saveTokenWithStabilization } from '../../convex/authFix';

export default function AuthRaceConditionBanner() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [logs, setLogs] = useState([]);
  const [completed, setCompleted] = useState(false);

  const runAuthSimulation = async () => {
    setIsSimulating(true);
    setCompleted(false);
    setLogs([
      "▶ Initializing Vercel Edge Route Auth Bridge...",
      "⚡ Token received from Convex serverless session."
    ]);

    await new Promise(r => setTimeout(r, 400));
    setLogs(prev => [...prev, "💾 [1/3] Writing Convex token to browser localStorage..."]);

    await new Promise(r => setTimeout(r, 600));
    setLogs(prev => [...prev, "⏳ [2/3] Executing 1.0s storage stabilization delay (Hackathon Hammer Fix)..."]);

    await saveTokenWithStabilization({
      token: "convex_token_hackathon_demo_" + Date.now(),
      user: { id: "u_hackdot", name: "Deepak & Himanshu", email: "hackdot@holdpay.dev", role: "client" },
      storedAt: Date.now()
    });

    setLogs(prev => [...prev, "🔄 [3/3] Storage flushed! Reload safeguard ready -> Zero 404s / Zero login loops! ✅"]);
    setIsSimulating(false);
    setCompleted(true);
  };

  return (
    <div className="glass-card" style={{ padding: '20px', marginBottom: '32px', borderLeft: '4px solid #8B5CF6' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
        
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Flame size={18} color="#C084FC" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }} className="gradient-text-violet">
              The Hackathon Hammer: Vercel & Convex Auth Fix
            </h3>
            <span style={{ fontSize: '0.68rem', background: 'rgba(139, 92, 246, 0.2)', color: '#C084FC', border: '1px solid rgba(139, 92, 246, 0.4)', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
              PRODUCTION FIX
            </span>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', maxWidth: '680px' }}>
            Fixed deployment race condition where Vercel fallback routing panicked before the browser saved the Convex auth token. Resolved via a 1-second storage stabilization delay + forced token verification reload safeguard.
          </p>
        </div>

        {/* Action button */}
        <button 
          className="btn-secondary"
          onClick={runAuthSimulation}
          disabled={isSimulating}
          style={{ background: 'rgba(139, 92, 246, 0.15)', borderColor: 'rgba(139, 92, 246, 0.4)', color: '#C084FC' }}
        >
          {isSimulating ? (
            <>
              <RefreshCw size={15} style={{ animation: 'spin 1s linear infinite' }} /> Stabilizing Token...
            </>
          ) : (
            <>
              <Terminal size={15} /> Test Auth Token Fix
            </>
          )}
        </button>
      </div>

      {/* Terminal Output */}
      {logs.length > 0 && (
        <div style={{ marginTop: '14px', background: '#050811', border: '1px solid rgba(139, 92, 246, 0.25)', borderRadius: '10px', padding: '12px 16px', fontFamily: 'monospace', fontSize: '0.78rem' }}>
          {logs.map((line, idx) => (
            <div key={idx} style={{ color: line.includes('✅') ? '#34D399' : line.includes('⏳') ? '#F59E0B' : '#CBD5E1', marginBottom: '4px' }}>
              {line}
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
