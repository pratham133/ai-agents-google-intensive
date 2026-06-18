# 🚀 Day 4 — Building an Expense Approval Agent

<div align="center">

### Google AI Agents Intensive Program

*Building decision-making AI agents using Google ADK and Gemini.*

![Status](https://img.shields.io/badge/Status-Completed-brightgreen)
![Day](https://img.shields.io/badge/Day-4-blue)
![Topic](https://img.shields.io/badge/Topic-Agent%20Decision%20Making-orange)
![Built With](https://img.shields.io/badge/Built%20With-Google%20ADK-red)
![Model](https://img.shields.io/badge/Model-Gemini%202.5%20Flash-purple)

</div>

---

# 📖 Overview

Day 4 focused on creating an AI-powered Expense Approval Agent capable of reviewing expense requests and determining whether they should be approved, rejected, or escalated for human review.

The project demonstrated how AI agents can apply structured business rules while still leveraging LLM reasoning for decision-making.

---

# 🎯 Day 4 Objectives

✅ Build a custom AI agent using Google ADK

✅ Define decision-making instructions

✅ Use Gemini 2.5 Flash as the reasoning engine

✅ Test agent responses through ADK

✅ Explore approval workflows

✅ Understand human-in-the-loop review systems

---

# 🧠 Project Built — Expense Approval Agent

A lightweight AI agent that reviews expense requests and classifies them into:

* APPROVE
* REVIEW
* REJECT

based on predefined business policies.

---

## ⚙️ Agent Architecture

```text
User Request
      ↓
Expense Approval Agent
      ↓
Decision Rules
      ↓
Gemini 2.5 Flash
      ↓
Classification
      ↓
APPROVE / REVIEW / REJECT
```

---

## 💻 Core Agent Configuration

```python
root_agent = Agent(
    model="gemini-2.5-flash",
    name="expense_approval_agent",
)
```

The agent follows instruction-based rules to determine whether an expense is:

* Reasonable and business-related
* Missing information
* Suspicious or personal
* Expensive enough to require human review

---

# 🛠️ Concepts Explored

### 🔹 Agent Instructions

Defined business policies directly in the system instructions.

### 🔹 Human-in-the-Loop Review

Escalated uncertain or high-value expenses for manual approval.

### 🔹 Decision Classification

Structured outputs for consistency and auditability.

### 🔹 Google ADK

Built and executed agents using the Agent Development Kit.

---

# 📂 Project Structure

```text
Day-4-expense-approval-agent/
│
├── README.md
├── screenshots/
└── expense_agent/
    ├── agent.py
    └── __init__.py
```

---

# 📸 Screenshots
# 🚀 Day 4 — Expense Approval Agent

<div align="center">

### Google AI Agents Intensive Program

*Building AI agents that make business decisions using Google ADK and Gemini.*

![Status](https://img.shields.io/badge/Status-Completed-brightgreen)
![Day](https://img.shields.io/badge/Day-4-blue)
![Topic](https://img.shields.io/badge/Topic-Expense%20Approval%20Agent-orange)
![Built With](https://img.shields.io/badge/Built%20With-Google%20ADK-red)
![Model](https://img.shields.io/badge/Model-Gemini%202.5%20Flash-purple)

</div>

---

# 📖 Overview

Day 4 focused on designing and deploying a decision-making AI agent using Google's Agent Development Kit (ADK).

The objective was to build an **Expense Approval Agent** capable of reviewing expense requests and determining whether they should be:

* ✅ Approved
* 👨‍💼 Sent for Human Review
* ❌ Rejected

This exercise demonstrated how AI agents can be used to automate business workflows while maintaining human oversight for high-risk decisions.

---

# 🎯 Learning Objectives

✅ Understand agent-based decision workflows

✅ Build a custom agent using Google ADK

✅ Configure Gemini as the reasoning engine

✅ Design structured approval policies

✅ Implement human-in-the-loop review systems

✅ Test and evaluate agent behavior

✅ Deploy and interact through ADK tools

---

# 🧠 Project Built — Expense Approval Agent

The Expense Approval Agent evaluates submitted expenses according to predefined business rules.

### Decision Categories

#### ✅ APPROVE

* Small business expenses
* Clear and reasonable purchases
* Standard operational costs

#### 👨‍💼 REVIEW

* High-value purchases
* Missing details
* Unusual requests
* Uncertain cases

#### ❌ REJECT

* Personal expenses
* Policy violations
* Suspicious spending patterns

---

# ⚙️ Agent Architecture

```text
Employee Expense Request
            ↓
 Expense Approval Agent
            ↓
     Gemini 2.5 Flash
            ↓
 Business Rules Engine
            ↓
 ┌─────────┬─────────┬─────────┐
 │ APPROVE │ REVIEW  │ REJECT  │
 └─────────┴─────────┴─────────┘
```

---

# 💻 Core Agent Configuration

```python
from google.adk.agents.llm_agent import Agent

root_agent = Agent(
    model="gemini-2.5-flash",
    name="expense_approval_agent",
    description="Reviews expense requests and decides whether approval requires human review."
)
```

The agent uses instruction-driven reasoning to classify requests while maintaining a consistent output format.

---

# 🛠️ Concepts Explored

### 🔹 Google ADK

Learned how agents are structured, configured, and executed.

### 🔹 LLM-Based Decision Making

Used Gemini 2.5 Flash to evaluate business requests.

### 🔹 Human-in-the-Loop Systems

Escalated uncertain decisions to human reviewers.

### 🔹 Structured Outputs

Produced predictable and auditable decision responses.

### 🔹 Business Rule Enforcement

Combined natural language reasoning with organizational policies.

---

# 📂 Project Structure

```text
Day-4-expense-approval-agent/
│
├── README.md
├── screenshots/
│   ├── 01-first-agent-response.png
│   ├── 02-adk-server-running.png
│   ├── 03-approved-expense.png
│   └── 04-review-expense.png
│
└── expense_agent/
    ├── agent.py
    └── __init__.py
```

---

# 📸 Screenshots

## 1️⃣ First Agent Response

![First Agent Response](screenshots/01-first-agent-response.png)

---

## 2️⃣ ADK Server Running

![ADK Server Running](screenshots/02-adk-server-running.png)

---

## 3️⃣ Approved Expense Example

![Approved Expense](screenshots/03-approved-expense.png)

---

## 4️⃣ Expense Requiring Human Review

![Review Expense](screenshots/04-review-expense.png)

---

# 🧩 Challenges Solved

| Problem                | Resolution                         |
| ---------------------- | ---------------------------------- |
| ADK setup issues       | Verified environment configuration |
| Agent execution errors | Corrected project structure        |
| Model configuration    | Connected Gemini 2.5 Flash         |
| Output consistency     | Added structured instructions      |
| Decision ambiguity     | Introduced REVIEW category         |

---

# 🔥 Key Takeaways

* AI agents can automate approval workflows
* Clear instructions improve decision consistency
* Human review remains critical for uncertain scenarios
* ADK simplifies agent development and testing
* Structured outputs improve reliability and auditing

---

# 🧰 Technologies Used

| Category    | Technology                 |
| ----------- | -------------------------- |
| Language    | Python                     |
| Framework   | Google ADK                 |
| Model       | Gemini 2.5 Flash           |
| IDE         | VS Code                    |
| Environment | Python Virtual Environment |

---

# 🚀 Outcome

Successfully built and tested an AI-powered Expense Approval Agent capable of classifying expense requests according to business policies while supporting human oversight where necessary.

---

<div align="center">

### 🌟 Day 4 Expense Approval Agent Successfully Completed

**"Good agents automate decisions. Great agents know when to ask for help."**

</div>

* Agent Response
* ADK Server Running
* Approved Expense Example
* Expense Requiring Review

---

# 🔥 Key Takeaways

* AI agents can automate business decisions
* Clear instructions improve reliability
* Human review remains important for high-risk actions
* ADK simplifies agent creation and testing

---

# 🧰 Technologies Used

| Category  | Technology       |
| --------- | ---------------- |
| Language  | Python           |
| Framework | Google ADK       |
| Model     | Gemini 2.5 Flash |
| IDE       | VS Code          |

---

# 🚀 Outcome

Successfully built and tested an Expense Approval Agent capable of classifying business expenses and supporting human review workflows.

---

<div align="center">

### 🌟 Day 4 Expense Approval Agent Completed

</div>
