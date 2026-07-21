import React, { useState } from 'react';
import { MessageSquare, Send, User, Bot, Sparkles } from 'lucide-react';

export default function LiveChatDrawer({ activeRole, project, chatMessages, onSendMessage }) {
  const [inputText, setInputText] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    onSendMessage({
      senderRole: activeRole,
      senderName: activeRole === 'client' ? project.clientName : project.freelancerName,
      message: inputText.trim(),
      timestamp: Date.now()
    });

    setInputText('');
  };

  return (
    <div className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={18} color="#06B6D4" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Real-Time Collaboration Chat</h3>
            <span style={{ fontSize: '0.68rem', background: 'rgba(6, 182, 212, 0.15)', color: '#38BDF8', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
              ROADMAP FEATURE
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Direct in-platform communication between client and freelancer linked directly to escrow milestones.
          </p>
        </div>

        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          Posting as: <strong style={{ color: activeRole === 'client' ? '#38BDF8' : '#C084FC' }}>
            {activeRole === 'client' ? project.clientName : project.freelancerName}
          </strong>
        </div>
      </div>

      {/* Message Feed */}
      <div className="glass-panel" style={{ height: '260px', padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
        {chatMessages.map((msg, idx) => {
          const isClient = msg.senderRole === 'client';
          return (
            <div 
              key={idx} 
              style={{ 
                alignSelf: isClient ? 'flex-start' : 'flex-end',
                maxWidth: '80%',
                background: isClient ? 'rgba(6, 182, 212, 0.12)' : 'rgba(139, 92, 246, 0.15)',
                border: isClient ? '1px solid rgba(6, 182, 212, 0.3)' : '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '12px',
                padding: '10px 14px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '4px', fontSize: '0.75rem' }}>
                <span style={{ fontWeight: 700, color: isClient ? '#38BDF8' : '#C084FC' }}>
                  {msg.senderName} ({msg.senderRole.toUpperCase()})
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div style={{ fontSize: '0.86rem', color: '#F8FAFC' }}>
                {msg.message}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Type a message to ${activeRole === 'client' ? 'freelancer' : 'client'}...`}
          style={{ 
            flex: 1, 
            padding: '10px 16px', 
            background: 'rgba(0, 0, 0, 0.4)', 
            border: '1px solid var(--border-glass)', 
            borderRadius: '10px', 
            color: '#FFF', 
            fontSize: '0.9rem' 
          }}
        />
        <button type="submit" className="btn-primary">
          <Send size={15} /> Send
        </button>
      </form>

    </div>
  );
}
