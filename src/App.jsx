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
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    if (user.role) {
      setActiveRole(user.role);
    }
    showToast(`Authenticated as ${user.name}`);
  };

  const handleSignOut = () => {
    clearAuthToken();
    setCurrentUser(null);
    showToast("Signed out of session");
  };

  // Handle assigning freelancer
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
    showToast(`Assigned ${freelancerName} to escrow project`);
  };

  // Handle submitting work
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
    showToast("Deliverable proof submitted for review");
  };

  // Handle Client One-Click Approve & Pay
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
    showToast("Milestone payout executed successfully");
  };

  // Create new project
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
    showToast("New escrow project created");
  };

  // Send chat message
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
    <div className="min-h-screen bg-zinc-50 text-zinc-950 font-sans pb-16">
      
      {/* Toast Notification - Minimal bottom-right */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-zinc-900 text-white text-xs px-3.5 py-2 rounded border border-zinc-800 shadow-none flex items-center gap-2 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar: Full-width, flush with top edge */}
      <Navbar 
        currentUser={currentUser}
        activeRole={activeRole} 
        setActiveRole={setActiveRole}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onSignOut={handleSignOut}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />

      <main className="max-w-6xl mx-auto px-6 pt-6">
        
        {/* Metric & Escrow Vault Card Header */}
        <EscrowVaultCard 
          project={displayProject} 
          milestones={displayMilestones} 
          activeRole={activeRole}
          onOpenAddFreelancerModal={() => setIsAddFreelancerModalOpen(true)}
        />

        {/* Navigation Tabs: Indigo Active Indicator */}
        <div className="border-b border-zinc-200 mb-6 flex gap-6">
          <button 
            onClick={() => setActiveTab('milestones')}
            className={`pb-2.5 text-xs tracking-tight transition-all border-b-2 -mb-px ${
              activeTab === 'milestones'
                ? 'border-indigo-600 text-indigo-600 font-medium'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            4-Tier Milestones
          </button>

          <button 
            onClick={() => setActiveTab('chat')}
            className={`pb-2.5 text-xs tracking-tight transition-all border-b-2 -mb-px ${
              activeTab === 'chat'
                ? 'border-indigo-600 text-indigo-600 font-medium'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Live Chat
          </button>

          <button 
            onClick={() => setActiveTab('transactions')}
            className={`pb-2.5 text-xs tracking-tight transition-all border-b-2 -mb-px ${
              activeTab === 'transactions'
                ? 'border-indigo-600 text-indigo-600 font-medium'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Audit Log ({displayTransactions.length})
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
          <div className="bg-white border border-zinc-200 rounded-md p-6 shadow-none">
            <div className="mb-4">
              <h3 className="text-sm font-semibold tracking-tight text-zinc-950">
                Audit & Transaction Feed
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Immutable ledger of all escrow deposits, assignments, and milestone payouts.
              </p>
            </div>

            <div className="divide-y divide-zinc-100">
              {displayTransactions.map((tx) => (
                <div key={tx.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0" />
                    <div>
                      <div className="text-xs font-medium text-zinc-950">
                        {tx.type === 'escrow_deposit' 
                          ? 'Escrow Deposit Locked' 
                          : tx.type === 'freelancer_assigned' 
                          ? 'Freelancer Assigned to Project' 
                          : `Tier ${tx.milestoneTier} Milestone Payout Released`}
                      </div>
                      <div className="text-[11px] text-zinc-500 font-mono mt-0.5">
                        {tx.sender} → {tx.recipient} • {new Date(tx.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="text-right pl-4">
                    <div className="text-sm font-mono tabular-nums font-semibold text-zinc-950">
                      {tx.type === 'freelancer_assigned' ? 'VERIFIED' : `$${tx.amount.toLocaleString()} USD`}
                    </div>
                    <div className="text-[10px] text-zinc-400 font-mono">
                      {tx.stripePaymentIntentId}
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
