// Convex Schema definition for HoldPay Escrow System with Convex Auth & User Storage
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  // Application User Profiles extending Convex Auth
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    role: v.optional(v.string()), // "client" | "freelancer"
  }),

  // Dedicated Table storing complete User Authentication & Profile Data
  userProfiles: defineTable({
    userId: v.string(), // Links to Convex Auth user ID
    tokenIdentifier: v.string(), // Stable auth identity token
    name: v.string(),
    email: v.string(),
    role: v.string(), // "client" | "freelancer"
    payoutWallet: v.optional(v.string()),
    bio: v.optional(v.string()),
    isVerified: v.boolean(),
    createdAt: v.number(),
    lastLoginAt: v.number(),
  })
    .index("by_tokenIdentifier", ["tokenIdentifier"])
    .index("by_email", ["email"])
    .index("by_role", ["role"])
    .index("by_userId", ["userId"]),

  projects: defineTable({
    title: v.string(),
    description: v.string(),
    clientName: v.string(),
    clientUserId: v.optional(v.string()),
    freelancerName: v.string(),
    freelancerEmail: v.optional(v.string()),
    freelancerUserId: v.optional(v.string()),
    freelancerStatus: v.optional(v.string()), // "assigned", "pending_invite", "unassigned"
    totalBudget: v.number(), // e.g. 5000 in USD
    escrowVaultBalance: v.number(), // Amount remaining locked
    releasedPayout: v.number(), // Amount paid out to freelancer
    status: v.string(), // "active", "completed", "cancelled"
    currentMilestoneTier: v.number(), // 1, 2, 3, or 4
    createdAt: v.number(),
    stripeVaultId: v.string(),
  }),

  milestones: defineTable({
    projectId: v.string(),
    tier: v.number(), // 1 to 4
    title: v.string(),
    description: v.string(),
    percentage: v.number(), // 25
    amount: v.number(), // totalBudget * 0.25
    status: v.string(), // "locked", "in_progress", "under_review", "approved"
    proofLink: v.optional(v.string()),
    submissionNotes: v.optional(v.string()),
    submittedAt: v.optional(v.number()),
    approvedAt: v.optional(v.number()),
  }),

  transactions: defineTable({
    projectId: v.string(),
    milestoneTier: v.number(),
    amount: v.number(),
    type: v.string(), // "escrow_deposit", "milestone_release", "freelancer_assigned", "refund"
    sender: v.string(),
    recipient: v.string(),
    timestamp: v.number(),
    stripePaymentIntentId: v.string(),
    status: v.string(), // "verified", "processing"
  }),

  chatMessages: defineTable({
    projectId: v.string(),
    senderRole: v.string(), // "client" | "freelancer"
    senderName: v.string(),
    message: v.string(),
    timestamp: v.number(),
  }),
});
