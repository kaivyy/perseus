---
name: perseus-logic
description: Business logic and race condition vulnerability analysis
---

# Perseus Business Logic Specialist

## Context & Authorization

**IMPORTANT:** This skill performs business logic security analysis on the **user's own codebase**. This is defensive security testing to find logic flaws that automated scanners miss.

**Authorization:** The user owns this codebase and has explicitly requested this specialized analysis.

---

## Overview

This specialist skill analyzes business logic vulnerabilities and race conditions - bugs that require understanding application context, not just technical patterns.

**When to Use:** After `/scan` identifies critical business flows (payments, auth, inventory, etc.).

**Goal:** Find logic flaws that allow users to bypass business rules, manipulate data, or exploit race conditions.

## Business Logic Risks Covered

| Risk | Description | Impact |
|------|-------------|--------|
| Race Conditions | TOCTOU, double-spend | Financial loss, data corruption |
| Price Manipulation | Client-side price trust | Revenue loss |
| Quantity Abuse | Negative quantities, overflow | Free products, DoS |
| Workflow Bypass | Skipping required steps | Policy violations |
| Coupon/Discount Abuse | Reuse, stacking, negative discounts | Revenue loss |
| Limit Bypass | Circumventing usage limits | Resource abuse |
| State Manipulation | Modifying session/application state | Privilege escalation |

## Execution Instructions

### Phase 1: Race Condition Analysis (3 Parallel Agents)

1.  **TOCTOU Analyst:**
    *   "Find Time-of-Check-to-Time-of-Use patterns. Look for: balance check then deduct, inventory check then reserve, permission check then action. Flag any gap between check and use without locking."

    **Pattern to Find:**
    ```javascript
    // Vulnerable - race window between check and update
    if (user.balance >= amount) {  // CHECK
      // ... race window ...
      user.balance -= amount;      // USE
      await user.save();
    }
    ```

2.  **Double-Spend Analyst:**
    *   "Analyze financial operations for double-processing. Check: payment processing, balance transfers, reward redemption. Flag non-atomic operations on shared resources."

3.  **Parallel Request Analyst:**
    *   "Identify operations vulnerable to parallel requests. Check: coupon redemption, vote counting, like/follow operations. Flag any increment/decrement without database-level atomicity."

### Phase 2: E-Commerce Logic Analysis (4 Parallel Agents)

1.  **Price Manipulation Analyst:**
    *   "Trace price data flow. Check if prices come from: client request, session storage, or database. Flag any price that client can modify. Check for: hidden form fields, API parameters, cart manipulation."

2.  **Quantity/Amount Analyst:**
    *   "Check numeric input handling. Test: negative quantities, zero values, decimal abuse (0.001), integer overflow, very large numbers. Flag missing validation on quantities and amounts."

3.  **Discount/Coupon Analyst:**
    *   "Analyze coupon and discount logic. Check for: coupon reuse, stacking multiple discounts, applying after price calculation, race conditions in redemption limit."

4.  **Cart/Checkout Analyst:**
    *   "Analyze shopping cart logic. Check for: item modification after checkout start, price changes during checkout, removing items after payment but before order creation."

### Phase 3: Workflow Analysis (3 Parallel Agents)

1.  **Step Bypass Analyst:**
    *   "Map multi-step workflows (checkout, registration, KYC). Check if steps can be skipped by direct API calls. Flag missing server-side step validation."

    **Workflows to Analyze:**
    - Registration → Email Verification → Profile Setup
    - Cart → Shipping → Payment → Confirmation
    - Request → Approval → Execution

2.  **State Machine Analyst:**
    *   "Find state-based entities (orders, tickets, accounts). Check for: invalid state transitions, missing state validation, client-controlled state."

3.  **Approval Bypass Analyst:**
    *   "Analyze approval workflows. Check for: self-approval, approver role bypass, approval after rejection, approval without request."

### Phase 4: Limit & Quota Analysis (2 Parallel Agents)

1.  **Rate Limit Bypass Analyst:**
    *   "Check rate limiting implementation. Test bypass via: different user agents, IP rotation, API key cycling, distributed requests. Flag client-side rate limiting."

2.  **Usage Quota Analyst:**
    *   "Analyze usage quotas and limits. Check for: limit reset manipulation, multiple account abuse, limit bypass via API, race conditions in limit tracking."

### Phase 5: Account Logic Analysis (2 Parallel Agents)

1.  **Account Takeover Analyst:**
    *   "Analyze account recovery flows. Check for: weak reset tokens, token reuse, link expiry, account enumeration, brute force protection."

2.  **Privilege Manipulation Analyst:**
    *   "Check for privilege escalation via logic flaws. Look for: role assignment in profile update, team invitation abuse, org creation for elevated access."

## Race Condition Testing Approach

```python
# Conceptual test script for race conditions
import asyncio
import aiohttp

async def exploit_race(session, url, payload):
    """Send 50 parallel requests to trigger race condition"""
    tasks = [session.post(url, json=payload) for _ in range(50)]
    responses = await asyncio.gather(*tasks)
    return responses

# Test: Can we redeem a single-use coupon multiple times?
# Test: Can we transfer more money than our balance?
# Test: Can we vote multiple times?
```

## Output Requirements

Create `deliverables/business_logic_analysis.md`:

```markdown
# Business Logic Security Analysis

## Summary
| Category | Flows Analyzed | Issues Found | Critical |
|----------|----------------|--------------|----------|
| Race Conditions | X | Y | Z |
| Price/Payment | X | Y | Z |
| Workflow | X | Y | Z |
| Limits/Quotas | X | Y | Z |
| Account Logic | X | Y | Z |

## Critical Findings

### [LOGIC-001] Race Condition in Balance Transfer
**Severity:** Critical
**Location:** `services/wallet.js:89`
**Flow:** User-to-User Money Transfer

**Vulnerable Code:**
```javascript
async function transfer(fromId, toId, amount) {
  const sender = await User.findById(fromId);

  if (sender.balance >= amount) {  // CHECK
    sender.balance -= amount;       // USE (race window!)
    await sender.save();

    const receiver = await User.findById(toId);
    receiver.balance += amount;
    await receiver.save();
  }
}
```

**Attack:**
1. User has $100 balance
2. Send 10 parallel requests to transfer $100 each
3. Due to race condition, multiple transfers succeed
4. Sender ends up with negative balance, receiver gets $1000

**Remediation:**
```javascript
async function transfer(fromId, toId, amount) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Atomic update with condition
    const result = await User.findOneAndUpdate(
      { _id: fromId, balance: { $gte: amount } },
      { $inc: { balance: -amount } },
      { session, new: true }
    );

    if (!result) throw new Error('Insufficient balance');

    await User.findByIdAndUpdate(toId,
      { $inc: { balance: amount } },
      { session }
    );

    await session.commitTransaction();
  } catch (e) {
    await session.abortTransaction();
    throw e;
  }
}
```

---

### [LOGIC-002] Price Manipulation in Checkout
**Severity:** Critical
...

## Workflow Security

| Workflow | Steps | Bypass Possible | Issue |
|----------|-------|-----------------|-------|
| Checkout | 4 | Yes | Step 2 skippable via direct API |
| Registration | 3 | No | Server validates each step |
| Password Reset | 2 | Yes | Token not invalidated after use |

## Race Condition Risk Map

| Operation | Atomic | Locking | Risk |
|-----------|--------|---------|------|
| Balance Transfer | No | No | CRITICAL |
| Coupon Redeem | No | No | HIGH |
| Like/Vote | No | No | MEDIUM |
| Order Create | Yes | Yes | LOW |

## Recommendations
1. Implement database-level atomicity for all financial operations
2. Use optimistic locking or transactions for race-prone operations
3. Validate all workflow steps server-side
4. Never trust client-provided prices or quantities
```

**Next Step:** Findings require custom exploit scripts to verify (parallel request testing).
