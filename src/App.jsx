import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import EscrowVaultCard from './components/EscrowVaultCard';
import MilestoneTracker from './components/MilestoneTracker';
import CreateProjectModal from './components/CreateProjectModal';
import LiveChatDrawer from './components/LiveChatDrawer';
import AuthModal from './components/AuthModal';
import AddFreelancerModal from './components/AddFreelancerModal';
import { createInitialProject } from '../convex/projects';
import { getAuthToken, clearAuthToken } from '../convex/authFix';
import { ShieldCheck, History, Sparkles, CheckCircle2, DollarSign, Lock, RefreshCw, Zap, UserPlus } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeRole, setActiveRole] = useState('client'); // 'client' | 'freelancer'
  const [activeTab, setActiveTab] = useState('milestones'); // 'milestones' | 'chat' | 'transactions'
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAddFreelancerModalOpen, setIsAddFreelancerModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Load stored auth session on mount
  useEffect(() => {
    const session = getAuthToken();
    if (session && session.user) {
      setCurrentUser(session.user);
      setActiveRole(session.user.role || 'client');
    }
  }, []);

  // Initialize sample project with 4-tier milestone logic
  const initialSetup = createInitialProject({
    title: "HoldPay FinTech Mobile Escrow App",
    description: "Building a high-throughput mobile escrow wallet with 4-tier automated milestone disbursements.",
    totalBudget: 4000,
    clientName: currentUser && currentUser.role === 'client' ? currentUser.name : "Acme Ventures (Client)",
    freelancerName: currentUser && currentUser.role === 'freelancer' ? currentUser.name : "Alex Rivera (Freelancer)",
    freelancerEmail: "alex@freelance.dev"
  });

  const [project, setProject] = useState(initialSetup.project);
  const [milestones, setMilestones] = useState(initialSetup.milestones);
  const [transactions, setTransactions] = useState([initialSetup.initialTransaction]);
  const [chatMessages, setChatMessages] = useState([
    {
      senderRole: 'client',
      senderName: initialSetup.project.clientName,
      message: 'Welcome to HoldPay! The total $4,000 budget is locked in the escrow vault.',
      timestamp: Date.now() - 3600000
    },
    {
      senderRole: 'freelancer',
      senderName: initialSetup.project.freelancerName,
      message: 'Great! Working on Tier 1 specifications and technical architecture now.',
      timestamp: Date.now() - 1800000
    }
  ]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    if (user.role) {
      setActiveRole(user.role);
    }
    showToast(`🔐 Authenticated as ${user.name} (${user.role.toUpperCase()})`);
  };

  const handleSignOut = () => {
    clearAuthToken();
    setCurrentUser(null);
    showToast("Signed out of HoldPay Convex session.");
  };

  // Handle assigning / adding freelancer to project
  const handleAssignFreelancer = ({ freelancerName, freelancerEmail }) => {
    setProject(prev => ({
      ...prev,
      freelancerName,
      freelancerEmail,
      freelancerStatus: 'assigned'
    }));

    // Add audit transaction log
    const assignTx = {
      id: "tx_assign_" + Math.random().toString(36).substr(2, 8),
      projectId: project.id,
      milestoneTier: 0,
      amount: 0,
      type: "freelancer_assigned",
      sender: project.clientName,
      recipient: freelancerName,
      timestamp: Date.now(),
      stripePaymentIntentId: "n/a",
      status: "verified"
    };
    setTransactions(prev => [assignTx, ...prev]);

    // Add system notification to chat
    setChatMessages(prev => [
      ...prev,
      {
        senderRole: 'client',
        senderName: project.clientName,
        message: `👤 Assigned freelancer ${freelancerName} (${freelancerEmail}) to this escrow project.`,
        timestamp: Date.now()
      }
    ]);

    showToast(`👤 Assigned ${freelancerName} to project escrow!`);
  };

  // Handle Freelancer submitting work for a milestone
  const handleSubmitWork = (milestoneId, proofLink, submissionNotes) => {
    setMilestones(prev => prev.map(m => {
      if (m.id === milestoneId) {
        return {
          ...m,
          status: 'under_review',
          proofLink,
          submissionNotes,
          submittedAt: Date.now()
        };
      }
      return m;
    }));

    showToast("📁 Milestone deliverable submitted! Client notified for verification.");
  };

  // Handle Client One-Click Approve & Pay!
  const handleApproveAndPay = (milestoneId) => {
    const targetMilestone = milestones.find(m => m.id === milestoneId);
    if (!targetMilestone) return;

    const payoutAmount = targetMilestone.amount;

    // 1. Update milestone status to approved
    setMilestones(prev => {
      const updated = prev.map(m => {
        if (m.id === milestoneId) {
          return { ...m, status: 'approved', approvedAt: Date.now() };
        }
        return m;
      });

      // Unlock next milestone if available
      const currentTier = targetMilestone.tier;
      if (currentTier < 4) {
        const nextIdx = updated.findIndex(m => m.tier === currentTier + 1);
        if (nextIdx !== -1 && updated[nextIdx].status === 'locked') {
          updated[nextIdx].status = 'in_progress';
        }
      }

      return updated;
    });

    // 2. Update project vault balance & released payout
    setProject(prev => ({
      ...prev,
      escrowVaultBalance: Math.max(0, prev.escrowVaultBalance - payoutAmount),
      releasedPayout: prev.releasedPayout + payoutAmount,
      currentMilestoneTier: Math.min(4, prev.currentMilestoneTier + 1)
    }));

    // 3. Add verified transaction log
    const newTx = {
      id: "tx_rel_" + Math.random().toString(36).substr(2, 8),
      projectId: project.id,
      milestoneTier: targetMilestone.tier,
      amount: payoutAmount,
      type: "milestone_release",
      sender: project.clientName,
      recipient: project.freelancerName,
      timestamp: Date.now(),
      stripePaymentIntentId: "pi_payout_" + Math.random().toString(36).substr(2, 8),
      status: "verified"
    };
    setTransactions(prev => [newTx, ...prev]);

    // 4. Add automated system chat message
    setChatMessages(prev => [
      ...prev,
      {
        senderRole: 'client',
        senderName: project.clientName,
        message: `🎉 APPROVED & PAID Tier ${targetMilestone.tier}! $${payoutAmount.toLocaleString()} USD routed directly to ${project.freelancerName}.`,
        timestamp: Date.now()
      }
    ]);

    showToast(`⚡ ONE-CLICK PAYOUT SUCCESSFUL! $${payoutAmount.toLocaleString()} USD transferred to ${project.freelancerName}`);
  };

  // Create new project handler
  const handleCreateProject = (data) => {
    const newSetup = createInitialProject(data);
    setProject(newSetup.project);
    setMilestones(newSetup.milestones);
    setTransactions([newSetup.initialTransaction]);
    setChatMessages([
      {
        senderRole: 'client',
        senderName: newSetup.project.clientName,
        message: `Created new project "${newSetup.project.title}". Budget $${newSetup.project.totalBudget.toLocaleString()} locked in vault!`,
        timestamp: Date.now()
      }
    ]);
    showToast(`✨ Escrow project created! $${data.totalBudget.toLocaleString()} locked in vault.`);
  };

  // Add chat message handler
  const handleSendMessage = (msg) => {
    setChatMessages(prev => [...prev, msg]);
  };

  return (
    <div style={{ minHeight: '100vh', pb: '50px' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{ 
          position: 'fixed', 
          bottom: '24px', 
          right: '24px', 
          zIndex: 2000, 
          background: 'linear-gradient(135deg, #10B981 0%, #047857 100%)', 
          color: '#FFF', 
          padding: '12px 20px', 
          borderRadius: '12px', 
          boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: 600,
          fontSize: '0.9rem',
          animation: 'modalSlideUp 0.3s ease-out'
        }}>
          <Sparkles size={18} /> {toastMessage}
        </div>
      )}

      {/* Navigation */}
      <Navbar 
        currentUser={currentUser}
        activeRole={activeRole} 
        setActiveRole={setActiveRole}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onSignOut={handleSignOut}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px 60px 20px' }}>
        
        {/* Escrow Vault Card Header */}
        <EscrowVaultCard 
          project={project} 
          milestones={milestones} 
          activeRole={activeRole}
          onOpenAddFreelancerModal={() => setIsAddFreelancerModalOpen(true)}
        />

        {/* Navigation Tabs */}
        <div className="glass-panel" style={{ padding: '6px', display: 'flex', gap: '6px', marginBottom: '24px' }}>
          <button 
            onClick={() => setActiveTab('milestones')}
            style={{ 
              flex: 1, 
              padding: '10px', 
              background: activeTab === 'milestones' ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
              border: activeTab === 'milestones' ? '1px solid rgba(6, 182, 212, 0.4)' : 'none',
              borderRadius: '8px',
              color: activeTab === 'milestones' ? '#38BDF8' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Zap size={16} /> 4-Tier Milestones
          </button>

          <button 
            onClick={() => setActiveTab('chat')}
            style={{ 
              flex: 1, 
              padding: '10px', 
              background: activeTab === 'chat' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
              border: activeTab === 'chat' ? '1px solid rgba(139, 92, 246, 0.4)' : 'none',
              borderRadius: '8px',
              color: activeTab === 'chat' ? '#C084FC' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Sparkles size={16} /> Live Collaboration Chat
          </button>

          <button 
            onClick={() => setActiveTab('transactions')}
            style={{ 
              flex: 1, 
              padding: '10px', 
              background: activeTab === 'transactions' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
              border: activeTab === 'transactions' ? '1px solid rgba(16, 185, 129, 0.4)' : 'none',
              borderRadius: '8px',
              color: activeTab === 'transactions' ? '#34D399' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <History size={16} /> Audit & Transaction Feed ({transactions.length})
          </button>
        </div>

        {/* Tab 1: Milestone Tracker */}
        {activeTab === 'milestones' && (
          <MilestoneTracker 
            milestones={milestones}
            activeRole={activeRole}
            onSubmitWork={handleSubmitWork}
            onApproveAndPay={handleApproveAndPay}
          />
        )}

        {/* Tab 2: Live Chat */}
        {activeTab === 'chat' && (
          <LiveChatDrawer 
            activeRole={activeRole}
            project={project}
            chatMessages={chatMessages}
            onSendMessage={handleSendMessage}
          />
        )}

        {/* Tab 3: Transaction Feed */}
        {activeTab === 'transactions' && (
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>
              Real-Time Escrow Transaction Log
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Immutable serverless audit log powered by Convex real-time synchronization.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {transactions.map((tx) => (
                <div key={tx.id} className="glass-panel" style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: tx.type === 'escrow_deposit' ? 'rgba(6, 182, 212, 0.15)' : tx.type === 'freelancer_assigned' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {tx.type === 'escrow_deposit' ? <Lock size={18} color="#38BDF8" /> : tx.type === 'freelancer_assigned' ? <UserPlus size={18} color="#C084FC" /> : <DollarSign size={18} color="#34D399" />}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>
                        {tx.type === 'escrow_deposit' ? 'Upfront Budget Escrow Deposit' : tx.type === 'freelancer_assigned' ? 'Freelancer Assigned to Escrow' : `Tier ${tx.milestoneTier} Milestone Payout Released`}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        From: {tx.sender} → To: {tx.recipient} | Stripe Intent ID: {tx.stripePaymentIntentId}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: tx.type === 'escrow_deposit' ? '#38BDF8' : tx.type === 'freelancer_assigned' ? '#C084FC' : '#34D399' }}>
                      {tx.type === 'freelancer_assigned' ? 'VERIFIED' : `$${tx.amount.toLocaleString()} USD`}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {new Date(tx.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Add Freelancer Modal */}
      <AddFreelancerModal 
        isOpen={isAddFreelancerModalOpen}
        onClose={() => setIsAddFreelancerModalOpen(false)}
        onAssignFreelancer={handleAssignFreelancer}
        currentFreelancer={{ name: project.freelancerName, email: project.freelancerEmail }}
      />

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Create Project Modal */}
      <CreateProjectModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateProject={handleCreateProject}
      />

    </div>
  );
}
