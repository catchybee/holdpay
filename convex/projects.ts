import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const DEFAULT_MILESTONE_TITLES = [
  "Tier 1: Kickoff & Technical Architecture Specs",
  "Tier 2: Core UX/UI Design & MVP Prototyping",
  "Tier 3: System Integration & API Engineering",
  "Tier 4: Final Verification & Code Handover"
];

// 1. Mutation to create a new project and populate projects, milestones, transactions, & chatMessages in Convex DB
export const createProject = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    totalBudget: v.number(),
    clientName: v.string(),
    freelancerName: v.string(),
    freelancerEmail: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const totalBudget = args.totalBudget || 4000;
    const milestoneAmount = totalBudget / 4;
    const stripeVaultId = "ch_vault_" + Math.random().toString(36).substr(2, 8);

    // Insert project document
    const projectId = await ctx.db.insert("projects", {
      title: args.title,
      description: args.description,
      clientName: args.clientName,
      freelancerName: args.freelancerName,
      freelancerEmail: args.freelancerEmail || "alex@freelance.dev",
      freelancerStatus: args.freelancerName ? "assigned" : "unassigned",
      totalBudget: totalBudget,
      escrowVaultBalance: totalBudget,
      releasedPayout: 0,
      status: "active",
      currentMilestoneTier: 1,
      createdAt: Date.now(),
      stripeVaultId: stripeVaultId,
    });

    // Insert 4 equal 25% milestone documents
    for (let i = 0; i < 4; i++) {
      await ctx.db.insert("milestones", {
        projectId: projectId,
        tier: i + 1,
        title: DEFAULT_MILESTONE_TITLES[i],
        description: `Deliverable for 25% budget release under milestone ${i + 1}.`,
        percentage: 25,
        amount: milestoneAmount,
        status: i === 0 ? "in_progress" : "locked",
      });
    }

    // Insert initial escrow deposit transaction document
    await ctx.db.insert("transactions", {
      projectId: projectId,
      milestoneTier: 0,
      amount: totalBudget,
      type: "escrow_deposit",
      sender: args.clientName,
      recipient: "HoldPay Escrow Vault",
      timestamp: Date.now(),
      stripePaymentIntentId: "pi_stripe_" + Math.random().toString(36).substr(2, 8),
      status: "verified",
    });

    // Insert initial welcome message in chatMessages table
    await ctx.db.insert("chatMessages", {
      projectId: projectId,
      senderRole: "client",
      senderName: args.clientName,
      message: `Welcome to HoldPay! The total $${totalBudget.toLocaleString()} budget is locked in the escrow vault.`,
      timestamp: Date.now(),
    });

    return projectId;
  },
});

// 2. Query to list all projects from Convex DB
export const getProjects = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("projects").order("desc").collect();
  },
});

// 3. Query to get milestones for a project
export const getMilestones = query({
  args: { projectId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (!args.projectId) return [];
    return await ctx.db
      .query("milestones")
      .filter((q) => q.eq(q.field("projectId"), args.projectId))
      .collect();
  },
});

// 4. Query to get transactions for a project
export const getTransactions = query({
  args: { projectId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (!args.projectId) return [];
    return await ctx.db
      .query("transactions")
      .filter((q) => q.eq(q.field("projectId"), args.projectId))
      .order("desc")
      .collect();
  },
});

// 5. Query to get chat messages for a project
export const getChatMessages = query({
  args: { projectId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (!args.projectId) return [];
    return await ctx.db
      .query("chatMessages")
      .filter((q) => q.eq(q.field("projectId"), args.projectId))
      .order("asc")
      .collect();
  },
});

// 6. Mutation for Freelancer submitting deliverable proof
export const submitMilestoneWork = mutation({
  args: {
    milestoneId: v.id("milestones"),
    proofLink: v.string(),
    submissionNotes: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.milestoneId, {
      status: "under_review",
      proofLink: args.proofLink,
      submissionNotes: args.submissionNotes,
      submittedAt: Date.now(),
    });
  },
});

// 7. Mutation for Client One-Click Approve & Pay!
export const approveAndPayMilestone = mutation({
  args: {
    milestoneId: v.id("milestones"),
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const milestone = await ctx.db.get(args.milestoneId);
    const project = await ctx.db.get(args.projectId);
    if (!milestone || !project) throw new Error("Milestone or Project not found");

    const payoutAmount = milestone.amount;

    // Approve milestone
    await ctx.db.patch(args.milestoneId, {
      status: "approved",
      approvedAt: Date.now(),
    });

    // Unlock next milestone tier if locked
    if (milestone.tier < 4) {
      const nextMilestones = await ctx.db
        .query("milestones")
        .filter((q) => q.eq(q.field("projectId"), args.projectId))
        .collect();
      const nextMilestone = nextMilestones.find((m) => m.tier === milestone.tier + 1);
      if (nextMilestone && nextMilestone.status === "locked") {
        await ctx.db.patch(nextMilestone._id, { status: "in_progress" });
      }
    }

    // Update project balances
    await ctx.db.patch(args.projectId, {
      escrowVaultBalance: Math.max(0, project.escrowVaultBalance - payoutAmount),
      releasedPayout: project.releasedPayout + payoutAmount,
      currentMilestoneTier: Math.min(4, project.currentMilestoneTier + 1),
    });

    // Insert payout transaction document
    await ctx.db.insert("transactions", {
      projectId: args.projectId,
      milestoneTier: milestone.tier,
      amount: payoutAmount,
      type: "milestone_release",
      sender: project.clientName,
      recipient: project.freelancerName,
      timestamp: Date.now(),
      stripePaymentIntentId: "pi_payout_" + Math.random().toString(36).substr(2, 8),
      status: "verified",
    });

    // Insert automated system chat message
    await ctx.db.insert("chatMessages", {
      projectId: args.projectId,
      senderRole: "client",
      senderName: project.clientName,
      message: `🎉 APPROVED & PAID Tier ${milestone.tier}! $${payoutAmount.toLocaleString()} USD routed directly to ${project.freelancerName}.`,
      timestamp: Date.now(),
    });
  },
});

// 8. Mutation to assign freelancer to project
export const assignFreelancer = mutation({
  args: {
    projectId: v.id("projects"),
    freelancerName: v.string(),
    freelancerEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    if (!project) throw new Error("Project not found");

    await ctx.db.patch(args.projectId, {
      freelancerName: args.freelancerName,
      freelancerEmail: args.freelancerEmail,
      freelancerStatus: "assigned",
    });

    await ctx.db.insert("transactions", {
      projectId: args.projectId,
      milestoneTier: 0,
      amount: 0,
      type: "freelancer_assigned",
      sender: project.clientName,
      recipient: args.freelancerName,
      timestamp: Date.now(),
      stripePaymentIntentId: "n/a",
      status: "verified",
    });

    await ctx.db.insert("chatMessages", {
      projectId: args.projectId,
      senderRole: "client",
      senderName: project.clientName,
      message: `👤 Assigned freelancer ${args.freelancerName} (${args.freelancerEmail}) to this escrow project.`,
      timestamp: Date.now(),
    });
  },
});

// 9. Mutation to post a chat message
export const sendChatMessage = mutation({
  args: {
    projectId: v.string(),
    senderRole: v.string(),
    senderName: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("chatMessages", {
      projectId: args.projectId,
      senderRole: args.senderRole,
      senderName: args.senderName,
      message: args.message,
      timestamp: Date.now(),
    });
  },
});

// 10. Seed initial demo data into Convex Cloud DB if table is empty
export const seedDemoProjectIfEmpty = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("projects").collect();
    if (existing.length > 0) {
      return existing[0]._id;
    }

    const projectId = await ctx.db.insert("projects", {
      title: "HoldPay FinTech Mobile Escrow App",
      description: "Building a high-throughput mobile escrow wallet with 4-tier automated milestone disbursements.",
      clientName: "Acme Ventures (Client)",
      freelancerName: "Alex Rivera (Freelancer)",
      freelancerEmail: "alex@freelance.dev",
      freelancerStatus: "assigned",
      totalBudget: 4000,
      escrowVaultBalance: 4000,
      releasedPayout: 0,
      status: "active",
      currentMilestoneTier: 1,
      createdAt: Date.now(),
      stripeVaultId: "ch_vault_" + Math.random().toString(36).substr(2, 8),
    });

    for (let i = 0; i < 4; i++) {
      await ctx.db.insert("milestones", {
        projectId: projectId,
        tier: i + 1,
        title: DEFAULT_MILESTONE_TITLES[i],
        description: `Deliverable for 25% budget release under milestone ${i + 1}.`,
        percentage: 25,
        amount: 1000,
        status: i === 0 ? "in_progress" : "locked",
      });
    }

    await ctx.db.insert("transactions", {
      projectId: projectId,
      milestoneTier: 0,
      amount: 4000,
      type: "escrow_deposit",
      sender: "Acme Ventures (Client)",
      recipient: "HoldPay Escrow Vault",
      timestamp: Date.now(),
      stripePaymentIntentId: "pi_stripe_" + Math.random().toString(36).substr(2, 8),
      status: "verified",
    });

    await ctx.db.insert("chatMessages", {
      projectId: projectId,
      senderRole: "client",
      senderName: "Acme Ventures (Client)",
      message: "Welcome to HoldPay! The total $4,000 budget is locked in the escrow vault.",
      timestamp: Date.now() - 3600000,
    });

    await ctx.db.insert("chatMessages", {
      projectId: projectId,
      senderRole: "freelancer",
      senderName: "Alex Rivera (Freelancer)",
      message: "Great! Working on Tier 1 specifications and technical architecture now.",
      timestamp: Date.now() - 1800000,
    });

    return projectId;
  },
});

export const createInitialProject = (data) => {
  const totalBudget = Number(data?.totalBudget) || 4000;
  const milestoneAmount = totalBudget / 4;

  const project = {
    id: "proj_" + Math.random().toString(36).substr(2, 9),
    title: data?.title || "FinTech Mobile Escrow App",
    description: data?.description || "Building a high-throughput mobile escrow wallet for freelance micro-transactions.",
    clientName: data?.clientName || "Acme Ventures (Client)",
    freelancerName: data?.freelancerName || "Alex Rivera (Freelancer)",
    freelancerEmail: data?.freelancerEmail || "alex@freelance.dev",
    freelancerStatus: data?.freelancerName ? "assigned" : "unassigned",
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

