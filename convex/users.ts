import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// 1. Store or update user profile and authentication data in Convex database
export const storeUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    role: v.string(), // "client" | "freelancer"
    payoutWallet: v.optional(v.string()),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const tokenIdentifier = identity ? identity.tokenIdentifier : `token_${args.email}`;
    const userId = identity ? identity.subject : `usr_${Math.random().toString(36).substr(2, 9)}`;

    // Check if user profile already exists by email or tokenIdentifier
    const existing = await ctx.db
      .query("userProfiles")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (existing !== null) {
      // Update existing user profile
      await ctx.db.patch(existing._id, {
        name: args.name,
        role: args.role,
        payoutWallet: args.payoutWallet || existing.payoutWallet,
        bio: args.bio || existing.bio,
        lastLoginAt: Date.now(),
      });
      return existing._id;
    } else {
      // Insert new user authentication & profile record into Convex DB
      const userProfileId = await ctx.db.insert("userProfiles", {
        userId: userId,
        tokenIdentifier: tokenIdentifier,
        name: args.name,
        email: args.email,
        role: args.role,
        payoutWallet: args.payoutWallet || "",
        bio: args.bio || "",
        isVerified: true,
        createdAt: Date.now(),
        lastLoginAt: Date.now(),
      });
      return userProfileId;
    }
  },
});

// 2. Query currently authenticated user profile
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const userProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    return userProfile;
  },
});

// 3. Update user profile details
export const updateUserProfile = mutation({
  args: {
    profileId: v.id("userProfiles"),
    name: v.optional(v.string()),
    role: v.optional(v.string()),
    payoutWallet: v.optional(v.string()),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const updates: Record<string, any> = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.role !== undefined) updates.role = args.role;
    if (args.payoutWallet !== undefined) updates.payoutWallet = args.payoutWallet;
    if (args.bio !== undefined) updates.bio = args.bio;

    await ctx.db.patch(args.profileId, updates);
    return true;
  },
});

// 4. List registered users by role ("client" or "freelancer")
export const listUsersByRole = query({
  args: { role: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userProfiles")
      .withIndex("by_role", (q) => q.eq("role", args.role))
      .collect();
  },
});

// 5. Legacy viewer query for backwards compatibility
export const viewer = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});
