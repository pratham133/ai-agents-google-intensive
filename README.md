<div align="center">

# 🚀 AI Agents — Google Intensive Program

*Documenting my journey through Google's AI Agents Intensive Program — notes, codelabs, projects, and deployments.*

![Status](https://img.shields.io/badge/Status-Completed-brightgreen)
![Days Completed](https://img.shields.io/badge/Days%20Completed-5%2F5-blue)
![Built With](https://img.shields.io/badge/Built%20With-Google%20ADK-red)
![License](https://img.shields.io/badge/License-MIT-yellow)

</div>

---

## 📖 About

This repo tracks my hands-on progress through Google's AI Agents Intensive Program — going from a basic AI-generated web app to building, securing, anddeploying real agents with Google's Agent Development Kit (ADK) and Gemini.

Each `Day-N` folder is a self-contained project with its own README, screenshots, and code — so you can jump into any single day without needing the rest.

---

## 🗂️ Program Progress

| Day | Topic                                  | What I Built                                      | Status |
|-----|-----------------------------------------|---------------------------------------------------|--------|
| 1   | Intro to AI Agents & Vibe Coding        | AI-generated Todo web app (Google AI Studio)       | ✅ |
| 2   | Agent Tools & Interoperability          | MCP-powered Google Drive upload script             | ✅ |
| 3   | Agent Skills & ADK                      | Study Buddy Agent (Google ADK + custom skill)       | ✅ |
| 4   | Decision-Making Agents                  | Expense Approval Agent (APPROVE/REVIEW/REJECT)      | ✅ |
| 4   | Secure Agentic Coding                   | Security layer (hooks, STRIDE model, pre-commit)    | ✅ |
| 5   | Production Agent Setup & Deployment     | Expense Agent w/ ADC auth + Terraform deployment    | ✅ |
| —   | Capstone-adjacent                       | Shopping Assistant agent (hardened in Day 4)        | ✅ |

---

## 🗺️ Repository Structure

```text
ai-agents-google-intensive/
│
├── Day-1/
│   └── my-first-project/        # AI-generated Todo app (HTML/CSS/JS)
│
├── Day-2/                       # MCP + Antigravity CLI exercises
│   ├── generated-code/
│   ├── notes/
│   └── screenshots/
│
├── Day-3/                       # Study Buddy Agent (Google ADK + skills)
│   ├── skill/
│   └── study_buddy_agent/
│
├── Day-4/
│   ├── expense-approval-agent/  # Decision-making agent (APPROVE/REVIEW/REJECT)
│   └── secure-agentic-coding/   # Security workflow built around shopping-assistant
│
├── Day-5/
│   └── expense-agent/           # Production-style ADK agent + Terraform deployment
│
├── shopping-assistant/          # ReAct agent scaffolded during Day 4, since hardened
│
├── LICENSE
└── README.md
```

---

## 📅 Day-by-Day Summaries

### Day 1 — Introduction to AI Agents & Vibe Coding
Built a complete Todo web app (HTML/CSS/JS) from a natural-language prompt using **Google AI Studio**, covering AI-assisted scaffolding, iterative prompting, and local testing.
📁 [`Day-1/my-first-project`](Day-1/my-first-project)

### Day 2 — Agent Tools & Interoperability
Explored the **Model Context Protocol (MCP)** — how agents discover and call external tools/APIs instead of relying on model memory alone. Used Antigravity CLI with the Google Developer Knowledge MCP Server to query live documentation and generate a working Google Drive upload script via OAuth 2.0.
📁 [`Day-2`](Day-2)

### Day 3 — Agent Skills & Google ADK
Built a **Study Buddy Agent** using Google's Agent Development Kit, introducing reusable "skills" as a way to make agents modular. Covered local agent execution (`adk run` / `adk web`) and debugging common environment issues (missing API keys, venv activation, deprecated models).
📁 [`Day-3`](Day-3)

### Day 4 — Decision-Making Agents: Expense Approval
Built an **Expense Approval Agent** that classifies requests as `APPROVE`, `REVIEW`, or `REJECT` using Gemini 2.5 Flash and rule-based business logic — with human-in-the-loop escalation for uncertain or high-value cases.
📁 [`Day-4/expense-approval-agent`](Day-4/expense-approval-agent)

### Day 4 — Secure Agentic Coding
Took a scaffolded **Shopping Assistant** agent and hardened it end-to-end: project-level security rules (`CONTEXT.md`), pre-commit Semgrep scanning, runtime tool-call validation hooks, and a custom **STRIDE threat-modeling skill**. This is the security workflow that produced the [`shopping-assistant`](shopping-assistant) project below.
📁 [`Day-4/secure-agentic-coding`](Day-4/secure-agentic-coding)

### Day 5 — Production Agent Setup & Deployment
Set up a production-style **Expense Agent** with Google ADK, managed via `uv`, authenticated through Application Default Credentials (ADC), and scaffolded with a full Terraform deployment (Cloud Run, IAM, telemetry). Debugged real deployment blockers along the way — disabled APIs, billing requirements, broken venvs after a project move.
📁 [`Day-5/expense-agent`](Day-5/expense-agent)

### Shopping Assistant (built during Day 4)
A ReAct agent generated with `agents-cli`, supporting product search, order tracking, and discount redemption. This is the project the Day 4 security workflow (hooks, Semgrep, STRIDE modeling) was built around — it now ships with the same Terraform/CI scaffolding as the Day 5 expense agent.
📁 [`shopping-assistant`](shopping-assistant)

---

## 🧰 Tech Stack

| Category          | Tools                                                |
|-------------------|-------------------------------------------------------|
| Language          | Python, JavaScript                                     |
| Agent Framework   | Google ADK, `agents-cli`                                |
| Models            | Gemini 2.5 Flash, Gemini Flash                          |
| Protocols         | Model Context Protocol (MCP)                            |
| Cloud             | Google Cloud (Vertex AI, Cloud Run, IAM, BigQuery)       |
| Infra as Code     | Terraform                                               |
| Security          | Semgrep, pre-commit, STRIDE threat modeling              |
| Package Managers  | `uv`, npm                                               |
| Tooling           | Antigravity CLI, VS Code                                |

---

## ▶️ Running a Project

Each day's project is self-contained with its own dependencies. General pattern for the ADK-based agents (Day 3 onward):

```bash
cd Day-N/project-folder
uv sync                  # or: pip install -r requirements.txt
adk web                  # launches the local agent UI at http://127.0.0.1:8000
```

Day 1 is a static frontend — just open `index.html`, or serve it with any static server.

Check each project's own `README.md` for exact setup steps, since requirements differ slightly day to day.

---

## 🎯 Learning Goals

- Understand AI agent architectures end to end from prompting to deployment
- Build practical, runnable agents rather than just theory
- Apply security practices to agentic systems, not just traditional code
- Document the process publicly as a portfolio of real, working projects

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

**5 days down. Building toward production-ready agentic systems, one project at a time.**

</div>