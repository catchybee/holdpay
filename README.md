# HoldPay 🚀

**Bridging the trust gap in the gig economy.**

HoldPay is a cloud-native, zero-friction escrow platform designed to eliminate payment fears for freelancers and clients. Rather than charging massive 20% platform commission fees, HoldPay secures transactions with a **0% escrow fee model**, locking project budgets upfront and releasing payouts across a strict 4-tier milestone engine.

HoldPay was built by **Team HackDot** (Deepak Kumar & Himanshu Pathak) for the **Cognitive Chaos Hackathon** organized by the **HackDriven Community**, and is published using **Enterpro** cloud hosting infrastructure.

---

## ⚡ Core Features

- **Zero-Friction Escrow Vault:** The total project budget is locked upfront in a serverless vault to guarantee funds exist before work begins.
- **Strict 4-Tier Milestone Logic:** Every project budget is split into four equal 25% installments, preventing scope creep and manual tracking disputes:
  - **Tier 1 (25%)**: Kickoff & Technical Architecture Specs
  - **Tier 2 (25%)**: Core UX/UI Design & MVP Prototyping
  - **Tier 3 (25%)**: System Integration & API Engineering
  - **Tier 4 (25%)**: Final Verification & Code Handover
- **One-Click Approve & Pay:** Client approves a milestone deliverable, instantly routing payout funds from the vault to the freelancer’s balance.
- **Real-Time Collaboration Chat:** An in-platform workspace messaging thread linked directly to active milestones.
- **Immutable Transaction Audit Log:** A Convex-backed transactional log recording every vault lock, milestone release, and freelancer assignment.

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** React 18, Vite, Lucide React icons, and custom glassmorphic CSS rules.
- **Backend & Database:** Convex Serverless Backend (real-time synced database and serverless functions).
- **Authentication:** `@convex-dev/auth` with Email & Password provider.
- **Hosting & Infrastructure:** Published live on **Enterpro** / **Vercel** cloud hosting.
- **Payments:** Stripe API integration simulation.

---

## 📂 Database Schema (`convex/schema.ts`)

Convex defines the following schema tables:

1. **`userProfiles`**: User credentials, bio, roles (`"client"` | `"freelancer"`), and payout details.
2. **`projects`**: active escrow projects, client/freelancer names, and budget state.
3. **`milestones`**: 4 deliverables per project with review proof links and statuses.
4. **`transactions`**: verified deposit and release audit ledger.
5. **`chatMessages`**: live messaging records.

---

## 🔨 Notable Hackathon Achievement: "The Hackathon Hammer"

During our Vercel + Convex production deployment, we encountered a critical race condition where Vercel fallback routing panicked before the browser saved the Convex auth token, causing login loops.

**The Fix (`convex/authFix.ts`):** 
We implemented a 1-second storage stabilization delay (`saveTokenWithStabilization`) before triggering a forced window reload (`window.location.href`) safeguard. This guarantees token persistence across edge routes, ensuring a 100% login success rate.

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js installed on your machine
- A Convex account and project

### Installation
1. Clone the repository and navigate to the project directory:
   ```bash
   cd HoldPay
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize the Convex environment:
   ```bash
   npx convex dev --once
   ```
4. Build the production bundle:
   ```bash
   npm run build
   ```
5. Launch the local Vite development server:
   ```bash
   npx vite --host --port 3000
   ```
6. Open **`http://localhost:3000`** in your browser.

---

## ☁️ Deployment

HoldPay can be deployed seamlessly to **Vercel** and **Enterpro**.

### Vercel Deployment Instructions:
1. Connect this repository to your Vercel Dashboard.
2. Set the framework preset to **Vite**.
3. In the project **Environment Variables**, add:
   - `VITE_CONVEX_URL`: your Convex cloud URL (e.g. `https://aromatic-chinchilla-574.convex.cloud`)
4. Click **Deploy**. Vercel will automatically build the application and route all requests cleanly via `vercel.json`.
