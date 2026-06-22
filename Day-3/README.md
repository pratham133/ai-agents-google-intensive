<div align="center">

# 🚀 Day 3 — Agent Skills & Building Intelligent AI Workflows

### Google AI Agents Intensive Program

*Building intelligent AI agents using reusable skills, structured instructions, and interactive learning workflows.*

![Status](https://img.shields.io/badge/Status-Completed-brightgreen)
![Day](https://img.shields.io/badge/Day-3-blue)
![Topic](https://img.shields.io/badge/Topic-Agent%20Skills-orange)
![Built With](https://img.shields.io/badge/Built%20With-Google%20ADK-red)
![Model](https://img.shields.io/badge/Model-Gemini%202.5%20Flash-purple)

</div>

---

# 📖 Overview

Day 3 focused on understanding how modern AI agents are designed, configured, and executed using **Google Agent Development Kit (ADK)**.

Unlike traditional prompt-based interactions, AI agents combine **instructions, models, skills, and execution workflows** to create structured and adaptive behavior.

Through hands-on implementation, I built and deployed a **Study Buddy Agent** — a Socratic-style learning assistant powered by **Gemini 2.5 Flash**.

---

# 🎯 Day 3 Objectives

✅ Understand AI Agent fundamentals
✅ Learn Agent Skills and modular workflows
✅ Build agents using Google ADK
✅ Configure runtime environments
✅ Connect agents to Gemini models
✅ Run and debug agents locally
✅ Design conversational instructions
✅ Explore Web UI execution
✅ Document the complete learning journey

---

# 🧠 Project Built — Study Buddy Agent

A conversational AI learning assistant designed around the **Socratic Method**.

### Features

🧩 Encourages active learning
🎯 Adapts to user familiarity
🧠 Guides through questions instead of answers
📚 Breaks complex concepts into smaller steps
🔁 Creates interactive learning loops

---

## ⚙️ Agent Architecture

```text
User
 ↓
Study Buddy Agent
 ↓
Instruction Layer
 ↓
Gemini 2.5 Flash
 ↓
Skill Execution
 ↓
Response Generation
 ↓
Interactive Learning
```

---

## 💻 Core Agent Configuration

```python
from google.adk.agents import Agent

study_buddy_instruction = (
    "You are a helpful Socratic study buddy."
)

root_agent = Agent(
    name="study_buddy",
    model="gemini-2.5-flash",
    description="Interactive AI tutor",
    instruction=study_buddy_instruction,
    tools=[]
)
```

---

# 🛠️ Skills & Concepts Explored

### 🔹 Agent Skills

Reusable capabilities that extend agent behavior without duplicating logic.

### 🔹 Google ADK

Learned agent architecture, root agents, execution flow, and model integration.

### 🔹 Antigravity CLI

Explored command-line AI workflows and developer tooling.

### 🔹 MCP Concepts

Studied interoperability, tool calling, and external integrations.

### 🔹 Environment Management

Configured virtual environments and secured API credentials using `.env`.

---

# 🧪 Commands Used

### Create Environment

```powershell
python -m venv .venv
.venv\Scripts\activate
```

### Install Dependencies

```powershell
pip install google-adk
```

### Run Agent

```powershell
adk run study_buddy_agent
```

### Launch Web UI

```powershell
adk web study_buddy_agent
```

Open:

```text
http://127.0.0.1:8000
```

---

# 📂 Project Structure

```text
Day-3/
│
├── README.md
├── screenshot/
├── skill/
└── study_buddy_agent/
    ├── .venv/
    ├── .env
    ├── agent.py
    ├── requirements.txt
    └── __init__.py
```

---

# 🧩 Challenges Solved

| Problem              | Resolution                     |
| -------------------- | ------------------------------ |
| Agent file not found | Corrected execution directory  |
| ModuleNotFoundError  | Activated virtual environment  |
| ADK command missing  | Used environment-local install |
| Missing API key      | Configured `.env`              |
| Deprecated model     | Migrated to Gemini 2.5 Flash   |
| Silent execution     | Used `adk run` / `adk web`     |

---

# 🔥 Key Takeaways

* AI agents combine **instructions + models + execution**
* Skills make agents modular and reusable
* Environment setup impacts reliability
* Debugging is a core part of agent development
* ADK accelerates local experimentation

---

# 🧰 Technologies Used

| Category    | Technology                 |
| ----------- | --------------------------- |
| Language    | Python                     |
| Framework   | Google ADK                 |
| Model       | Gemini 2.5 Flash           |
| Tooling     | Antigravity CLI            |
| Environment | Python Virtual Environment |
| Deployment  | ngrok                      |
| IDE         | VS Code                    |

---

# 🚀 Outcome

Successfully built, configured, tested, and deployed a working AI learning agent using Google ADK.

This project demonstrated how modern AI systems evolve from simple prompting into **interactive, skill-driven, execution-capable agents**.

---

<div align="center">

### 🌟 Day 3 Successfully Completed

**"Great AI agents don't just provide answers — they create better thinking."**

</div>