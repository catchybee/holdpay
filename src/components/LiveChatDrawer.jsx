import React, { useState } from 'react';

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
    <div className="bg-white border border-zinc-200 rounded-md p-6 shadow-none mb-10">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-zinc-100">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-zinc-950">
            Live Project Discussion
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Direct real-time communication between client and freelancer for milestone coordination.
          </p>
        </div>

        <div className="text-xs text-zinc-500 font-mono">
          Sending as:{' '}
          <span className="font-semibold text-zinc-950">
            {activeRole === 'client' ? project.clientName : project.freelancerName}
          </span>
        </div>
      </div>

      {/* Message Feed */}
      <div className="h-64 overflow-y-auto flex flex-col gap-2.5 p-3 bg-zinc-50 border border-zinc-200 rounded mb-4">
        {chatMessages.map((msg, idx) => {
          const isClient = msg.senderRole === 'client';
          return (
            <div 
              key={idx} 
              className={`max-w-[80%] rounded p-2.5 text-xs ${
                isClient 
                  ? 'self-start bg-white border border-zinc-200' 
                  : 'self-end bg-zinc-900 text-white'
              }`}
            >
              <div className="flex items-center justify-between gap-4 mb-1">
                <span className={`font-mono text-[10px] uppercase font-semibold ${isClient ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  {msg.senderName} ({msg.senderRole})
                </span>
                <span className={`font-mono text-[10px] ${isClient ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className={`text-xs ${isClient ? 'text-zinc-900' : 'text-zinc-100'}`}>
                {msg.message}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input 
          type="text" 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Write message to ${activeRole === 'client' ? 'freelancer' : 'client'}...`}
          className="flex-1 text-xs"
        />
        <button 
          type="submit" 
          className="h-8 px-4 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded shadow-sm transition-colors"
        >
          Send
        </button>
      </form>

    </div>
  );
}
