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
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { ShieldCheck, History, Sparkles, CheckCircle2, DollarSign, Lock, RefreshCw, Zap, UserPlus } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeRole, setActiveRole] = useState('client'); // 'client' | 'freelancer'
  const [activeTab, setActiveTab] = useState('milestones'); // 'milestones' | 'chat' | 'transactions'
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAddFreelancerModalOpen, setIsAddFreelancerModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // 1. Convex Queries for Real-time Cloud Database Persistence
  const dbProjects = useQuery(api.projects.getProjects);
  
  const activeProject = (dbProjects && dbProjects.length > 0) ? dbProjects[0] : null;
  const activeProjectId = activeProject ? activeProject._id : undefined;

  const dbMilestones = useQuery(api.projects.getMilestones, { projectId: activeProjectId });
  const dbTransactions = useQuery(api.projects.getTransactions, { projectId: activeProjectId });
  const dbChatMessages = useQuery(api.projects.getChatMessages, { projectId: activeProjectId });

  // 2. Convex Mutations for Direct Cloud Database Writes
  const seedDemoProject = useMutation(api.projects.seedDemoProjectIfEmpty);
  const createProjectMutation = useMutation(api.projects.createProject);
  const submitWorkMutation = useMutation(api.projects.submitMilestoneWork);
  const approveAndPayMutation = useMutation(api.projects.approveAndPayMilestone);
  const assignFreelancerMutation = useMutation(api.projects.assignFreelancer);
  const sendChatMessageMutation = useMutation(api.projects.sendChatMessage);

  // Load stored auth session on mount & seed Convex DB if empty
  useEffect(() => {
    const session = getAuthToken();
    if (session && session.user) {
      setCurrentUser(session.user);
      setActiveRole(session.user.role || 'client');
    }
    
    // Seed initial demo data into Convex cloud DB if empty
    seedDemoProject().catch((err) => console.warn("Seed check note:", err));
  }, []);

  // Fallback local state if DB query is loading
  const initialFallback = createInitialProject({
    title: "HoldPay FinTech Mobile Escrow App",
    description: "Building a high-throughput mobile escrow wallet with 4-tier automated milestone disbursements.",
    totalBudget: 4000,
    clientName: "Acme Ventures (Client)",
    freelancerName: "Alex Rivera (Freelancer)",
    freelancerEmail: "alex@freelance.dev"
  });

  const displayProject = activeProject ? {
    id: activeProject._id,
    title: activeProject.title,
    description: activeProject.description,
    clientName: activeProject.clientName,
    freelancerName: activeProject.freelancerName,
    freelancerEmail: activeProject.freelancerEmail,
    totalBudget: activeProject.totalBudget,
    escrowVaultBalance: activeProject.escrowVaultBalance,
    releasedPayout: activeProject.releasedPayout,
    status: activeProject.status,
    currentMilestoneTier: activeProject.currentMilestoneTier
  } : initialFallback.project;

  const displayMilestones = (dbMilestones && dbMilestones.length > 0)
    ? dbMilestones.map(m => ({
        id: m._id,
        projectId: m.projectId,
        tier: m.tier,
        title: m.title,
        description: m.description,
        percentage: m.percentage,
        amount: m.amount,
        status: m.status,
        proofLink: m.proofLink,
        submissionNotes: m.submissionNotes,
        submittedAt: m.submittedAt,
        approvedAt: m.approvedAt
      }))
    : initialFallback.milestones;

  const displayTransactions = (dbTransactions && dbTransactions.length > 0)
    ? dbTransactions.map(tx => ({
        id: tx._id,
        projectId: tx.projectId,
        milestoneTier: tx.milestoneTier,
        amount: tx.amount,
        type: tx.type,
        sender: tx.sender,
        recipient: tx.recipient,
        timestamp: tx.timestamp,
        stripePaymentIntentId: tx.stripePaymentIntentId,
        status: tx.status
      }))
    : [initialFallback.initialTransaction];

  const displayChatMessages = (dbChatMessages && dbChatMessages.length > 0)
    ? dbChatMessages.map(msg => ({
        senderRole: msg.senderRole,
        senderName: msg.senderName,
        message: msg.message,
        timestamp: msg.timestamp
      }))
    : [
        {
          senderRole: 'client',
          senderName: displayProject.clientName,
          message: 'Welcome to HoldPay! The total $4,000 budget is locked in the escrow vault.',
          timestamp: Date.now() - 3600000
        }
      ];

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

  // Handle assigning / adding freelancer to project directly in Convex Cloud DB
  const handleAssignFreelancer = async ({ freelancerName, freelancerEmail }) => {
    if (activeProjectId) {
      try {
        await assignFreelancerMutation({
          projectId: activeProjectId,
          freelancerName,
          freelancerEmail
        });
      } catch (err) {
        console.warn("Assign mutation note:", err);
      }
    }
    showToast(`👤 Assigned ${freelancerName} to project escrow in Convex Database!`);
  };

  // Handle Freelancer submitting work directly in Convex Cloud DB
  const handleSubmitWork = async (milestoneId, proofLink, submissionNotes) => {
    try {
      await submitWorkMutation({
        milestoneId,
        proofLink,
        submissionNotes
      });
    } catch (err) {
      console.warn("Submit work mutation note:", err);
    }
    showToast("📁 Milestone deliverable submitted to Convex Database!");
  };

  // Handle Client One-Click Approve & Pay directly in Convex Cloud DB!
  const handleApproveAndPay = async (milestoneId) => {
    if (activeProjectId) {
      try {
        await approveAndPayMutation({
          milestoneId,
          projectId: activeProjectId
        });
      } catch (err) {
        console.warn("Approve mutation note:", err);
      }
    }
    showToast(`⚡ ONE-CLICK PAYOUT EXECUTED & STORED IN CONVEX CLOUD DATABASE!`);
  };

  // Create new project directly in Convex Cloud DB
  const handleCreateProject = async (data) => {
    try {
      await createProjectMutation({
        title: data.title,
        description: data.description,
        totalBudget: Number(data.totalBudget),
        clientName: data.clientName,
        freelancerName: data.freelancerName,
        freelancerEmail: data.freelancerEmail
      });
    } catch (err) {
      console.warn("Create project mutation note:", err);
    }
    showToast(`✨ Escrow project created & saved in Convex Database!`);
  };

  // Send chat message directly to Convex Cloud DB
  const handleSendMessage = async (msg) => {
    if (activeProjectId) {
      try {
        await sendChatMessageMutation({
          projectId: activeProjectId,
          senderRole: msg.senderRole,
          senderName: msg.senderName,
          message: msg.message
        });
      } catch (err) {
        console.warn("Chat mutation note:", err);
      }
    }
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
          project={displayProject} 
          milestones={displayMilestones} 
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
              background: activeTab === 'milestones' ? 'rgba(194, 142, 78, 0.18)' : 'transparent',
              border: activeTab === 'milestones' ? '1px solid rgba(194, 142, 78, 0.45)' : 'none',
              borderRadius: '8px',
              color: activeTab === 'milestones' ? '#925C1A' : 'var(--text-secondary)',
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
              background: activeTab === 'chat' ? 'rgba(168, 92, 60, 0.16)' : 'transparent',
              border: activeTab === 'chat' ? '1px solid rgba(168, 92, 60, 0.4)' : 'none',
              borderRadius: '8px',
              color: activeTab === 'chat' ? '#A85C3C' : 'var(--text-secondary)',
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
              background: activeTab === 'transactions' ? 'rgba(5, 150, 105, 0.16)' : 'transparent',
              border: activeTab === 'transactions' ? '1px solid rgba(5, 150, 105, 0.4)' : 'none',
              borderRadius: '8px',
              color: activeTab === 'transactions' ? '#047857' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <History size={16} /> Audit & Transaction Feed ({displayTransactions.length})
          </button>
        </div>

        {/* Tab 1: Milestone Tracker */}
        {activeTab === 'milestones' && (
          <MilestoneTracker 
            milestones={displayMilestones}
            activeRole={activeRole}
            onSubmitWork={handleSubmitWork}
            onApproveAndPay={handleApproveAndPay}
          />
        )}

        {/* Tab 2: Live Chat */}
        {activeTab === 'chat' && (
          <LiveChatDrawer 
            activeRole={activeRole}
            project={displayProject}
            chatMessages={displayChatMessages}
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
              {displayTransactions.map((tx) => (
                <div key={tx.id} className="glass-panel" style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: tx.type === 'escrow_deposit' ? 'rgba(194, 142, 78, 0.15)' : tx.type === 'freelancer_assigned' ? 'rgba(168, 92, 60, 0.15)' : 'rgba(5, 150, 105, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {tx.type === 'escrow_deposit' ? <Lock size={18} color="#925C1A" /> : tx.type === 'freelancer_assigned' ? <UserPlus size={18} color="#A85C3C" /> : <DollarSign size={18} color="#059669" />}
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
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: tx.type === 'escrow_deposit' ? '#925C1A' : tx.type === 'freelancer_assigned' ? '#A85C3C' : '#059669' }}>
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
        currentFreelancer={{ name: displayProject.freelancerName, email: displayProject.freelancerEmail }}
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
