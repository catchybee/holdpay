// Convex serverless mutations & queries for HoldPay Escrow operations

export const DEFAULT_MILESTONE_TITLES = [
  "Tier 1: Kickoff & Technical Architecture Specs",
  "Tier 2: Core UX/UI Design & MVP Prototyping",
  "Tier 3: System Integration & API Engineering",
  "Tier 4: Final Verification & Code Handover"
];

export const createInitialProject = (data) => {
  const totalBudget = Number(data.totalBudget) || 4000;
  const milestoneAmount = totalBudget / 4;

  const project = {
    id: "proj_" + Math.random().toString(36).substr(2, 9),
    title: data.title || "FinTech Mobile Escrow App",
    description: data.description || "Building a high-throughput mobile escrow wallet for freelance micro-transactions.",
    clientName: data.clientName || "Acme Ventures (Client)",
    freelancerName: data.freelancerName || "Alex Rivera (Freelancer)",
    freelancerEmail: data.freelancerEmail || "alex@freelance.dev",
    freelancerStatus: data.freelancerName ? "assigned" : "unassigned",
    totalBudget: totalBudget,
    escrowVaultBalance: totalBudget,
    releasedPayout: 0,
    status: "active",
    currentMilestoneTier: 1,
    createdAt: Date.now(),
    stripeVaultId: "ch_vault_" + Math.random().toString(36).substr(2, 8),
  };

  const milestones = DEFAULT_MILESTONE_TITLES.map((title, index) => ({
    id: `ms_${project.id}_${index + 1}`,
    projectId: project.id,
    tier: index + 1,
    title: title,
    description: `Deliverable for 25% budget release under milestone ${index + 1}.`,
    percentage: 25,
    amount: milestoneAmount,
    status: index === 0 ? "in_progress" : "locked",
    proofLink: "",
    submissionNotes: "",
    submittedAt: null,
    approvedAt: null,
  }));

  const initialTransaction = {
    id: "tx_init_" + Math.random().toString(36).substr(2, 8),
    projectId: project.id,
    milestoneTier: 0,
    amount: totalBudget,
    type: "escrow_deposit",
    sender: project.clientName,
    recipient: "HoldPay Escrow Vault",
    timestamp: Date.now(),
    stripePaymentIntentId: "pi_stripe_" + Math.random().toString(36).substr(2, 8),
    status: "verified"
  };

  return { project, milestones, initialTransaction };
};
