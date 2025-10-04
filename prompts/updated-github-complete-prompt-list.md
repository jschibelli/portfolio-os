# Updated GitHub Complete Prompt List - Multi-Agent System

Here's the updated set of ready-to-paste one-liners for the multi-agent automation system (swap in your links/values).

## 🤖 **Multi-Agent System Prompts**

### **Start Multi-Agent Processing**
- Start multi-agent automation: Process up to 10 issues using specialized agents. Let the system automatically assign issues to the most suitable agent (Frontend, Content, Infrastructure, Documentation, or Backend) based on analysis.
- Monitor multi-agent system: Show current status of all agents, their workload, and any bottlenecks. Provide real-time monitoring of the agent coordination system.
- Process issue with optimal agent: Analyze issue #[NUMBER] and assign it to the most suitable agent based on content analysis, complexity assessment, and agent capabilities.

### **Agent-Specific Workflows**
- Frontend agent workflow: Assign this issue to the Frontend Agent for React component development, UI/UX implementation, styling, and user interaction features.
- Content agent workflow: Assign this issue to the Content Agent for blog post creation, article writing, SEO optimization, and content management.
- Infrastructure agent workflow: Assign this issue to the Infrastructure Agent for CI/CD pipeline management, deployment automation, security implementation, and system operations.
- Documentation agent workflow: Assign this issue to the Documentation Agent for technical documentation, API docs, user guides, and knowledge base management.
- Backend agent workflow: Assign this issue to the Backend Agent for API development, database design, server logic, and backend services.

### **Agent Coordination**
- Balance agent workload: Analyze current agent assignments and redistribute work to ensure optimal load balancing across all agents.
- Coordinate agents: Manage multi-agent coordination for complex projects requiring multiple agents. Handle dependencies and integration points.
- Intelligent issue assignment: Analyze issue #[NUMBER] for complexity, required skills, dependencies, and optimal agent assignment with detailed justification.

## 🎯 **Issue-Focused Multi-Agent Prompts**

### **Issue Analysis and Assignment**
- Analyze and plan with multi-agent system: <ISSUE_URL>. Generate plan, assign to optimal agent, create work tree, and execute complete workflow.
- Auto-configure and assign to agent: <ISSUE_URL>. Set Status=Ready, Priority=P1, Size=M, App=Portfolio Site, Area=Frontend; assign to optimal agent based on content analysis.
- Start multi-agent work: <ISSUE_URL>. Assign to optimal agent, set Status=In progress, create work tree, list first 3 steps for assigned agent.
- Implement end-to-end with agent: <ISSUE_URL>. Analyze, assign to optimal agent, create work tree, implement with specialized agent, monitor progress, guide to merge.
- Multi-agent grooming: <ISSUE_URL>. Break into subtasks, assign to appropriate agents, provide estimates and coordination plan.

### **Agent Workflow Management**
- Frontend agent implementation: <ISSUE_URL>. Assign to Frontend Agent, create React components, implement UI/UX, handle styling and interactions.
- Content agent implementation: <ISSUE_URL>. Assign to Content Agent, create engaging content, optimize for SEO, manage publishing workflow.
- Infrastructure agent implementation: <ISSUE_URL>. Assign to Infrastructure Agent, implement CI/CD, handle deployment, manage security and monitoring.
- Documentation agent implementation: <ISSUE_URL>. Assign to Documentation Agent, create technical docs, write user guides, manage knowledge base.
- Backend agent implementation: <ISSUE_URL>. Assign to Backend Agent, develop APIs, design database, implement server logic and integrations.

## 🔄 **PR-Focused Multi-Agent Prompts**

### **Multi-Agent PR Processing**
- Automate PR with multi-agent system: <PR_URL>. Analyze PR content, assign to appropriate agent for review, monitor CR‑GPT, draft threaded replies, update Project Status, run checks, drive to merge.
- Multi-agent review summary: <PR_URL>. Summarize reviewer+CR‑GPT comments by priority, identify which agent should handle each comment, provide action checklist.
- Agent-specific draft replies: <PR_URL>. Generate threaded replies for unresolved comments, assign to appropriate agents for follow-up, coordinate response strategy.
- Multi-agent conflict guard: <PR_URL>. Check mergeability, attempt auto-rebase, coordinate with relevant agents for conflict resolution, report outcome.
- Agent metadata & routing: <PR_URL>. Add labels [type: enhancement, area: frontend], assign to appropriate agents, request reviewers, link related issues.
- Multi-agent merge prep: <PR_URL>. Verify all comments resolved, coordinate with agents for final review, produce merge checklist with agent coordination.
- Agent changelog: <PR_URL>. Draft release notes, coordinate with agents for documentation updates, improve PR description with agent input.

### **Agent-Specific PR Handling**
- Frontend agent PR review: <PR_URL>. Assign to Frontend Agent for React component review, UI/UX analysis, styling validation, and user interaction testing.
- Content agent PR review: <PR_URL>. Assign to Content Agent for content review, SEO analysis, writing quality assessment, and publishing workflow validation.
- Infrastructure agent PR review: <PR_URL>. Assign to Infrastructure Agent for CI/CD review, deployment validation, security analysis, and system operations testing.
- Documentation agent PR review: <PR_URL>. Assign to Documentation Agent for documentation review, technical writing assessment, user guide validation, and knowledge base updates.
- Backend agent PR review: <PR_URL>. Assign to Backend Agent for API review, database analysis, server logic validation, and integration testing.

## 🔧 **Cross-Cutting Multi-Agent Prompts**

### **System-Wide Operations**
- Multi-agent status update: <URL>. Set Status=<ready|in progress|in review|done>, Priority=<p0|p1|p2>, coordinate with relevant agents, add labels <LABELS>.
- Agent test & QA: <PR_URL>. Run lint/test/build summary across all agents, list failures with agent-specific fixes, coordinate testing strategy.
- Multi-agent security scan: <PR_URL>. Identify security-sensitive diffs, assign to Infrastructure Agent for analysis, propose mitigations with agent coordination.
- Agent performance pass: <PR_URL>. Inspect hotspots across all agents, propose measurable optimizations, coordinate performance improvements.
- Multi-agent docs pass: <PR_URL>. Identify docs to update, assign to Documentation Agent, draft changes with agent coordination.
- Agent backport/cherry-pick: <PR_URL>. Create backport PR to <BRANCH> with minimal diffs, coordinate with relevant agents for implementation.

### **Agent Coordination Operations**
- Multi-agent dependency refresh: <URL>. Propose safe dependency updates, coordinate with Infrastructure Agent for impact analysis, provide agent-specific impact notes.
- Agent dead code/find TODOs: <PR_URL>. Flag dead code across all agents, convert TODOs into actionable tasks with agent owners, coordinate cleanup.
- Multi-agent risk assessment: <URL>. Summarize risks across all agents, coordinate rollback plan, provide validation steps with agent-specific responsibilities.

## 🚀 **Universal Multi-Agent Prompts**

### **Complete Automation**
- Multi-agent autopilot: <URL>. Detect issue vs PR; for issues, analyze, assign to optimal agent, create work tree, implement, monitor progress; for PRs, coordinate with agents, monitor reviews, analyze CR‑GPT, thread replies, update Status, run checks, drive to merge.
- Universal multi-agent automation: <PR_NUMBER>. Configure project fields, assign to appropriate agents, monitor CR‑GPT, generate responses, check merge readiness, provide guidance with agent coordination.

### **System Management**
- Multi-agent system health: Check health of all agents, work trees, state synchronization, and system performance. Provide comprehensive system status.
- Agent workload analysis: Analyze workload distribution across all agents, identify bottlenecks, suggest rebalancing, optimize agent utilization.
- Multi-agent performance metrics: Analyze performance metrics for each agent, system-wide efficiency, quality scores, and optimization opportunities.

## 🔍 **Advanced Multi-Agent Prompts**

### **Intelligent Coordination**
- Agent dependency management: <URL>. Analyze dependencies between agents, coordinate work sequencing, manage integration points, prevent conflicts.
- Multi-agent quality gates: <PR_URL>. Implement quality gates across all agents, coordinate testing strategy, ensure consistent quality standards.
- Agent workflow optimization: <URL>. Optimize agent workflows, improve coordination efficiency, enhance parallel processing capabilities.

### **Specialized Agent Operations**
- Frontend agent optimization: <URL>. Optimize Frontend Agent performance, improve React development workflow, enhance UI/UX capabilities.
- Content agent SEO optimization: <URL>. Optimize Content Agent for SEO, improve content quality, enhance publishing workflow.
- Infrastructure agent security: <URL>. Enhance Infrastructure Agent security capabilities, improve CI/CD security, strengthen deployment processes.
- Documentation agent knowledge management: <URL>. Optimize Documentation Agent for knowledge management, improve technical writing, enhance user guides.
- Backend agent API optimization: <URL>. Optimize Backend Agent for API development, improve database design, enhance server performance.

## 📊 **Monitoring and Analytics Prompts**

### **System Monitoring**
- Multi-agent system dashboard: Provide comprehensive dashboard showing all agents, their status, workload, progress, and system health.
- Agent performance analytics: Analyze performance metrics for each agent, identify optimization opportunities, provide improvement recommendations.
- Multi-agent quality metrics: Analyze quality metrics across all agents, identify quality trends, provide quality improvement strategies.

### **Troubleshooting**
- Multi-agent diagnostics: Diagnose issues across all agents, identify root causes, provide resolution strategies, coordinate recovery procedures.
- Agent conflict resolution: Identify and resolve conflicts between agents, coordinate integration, prevent merge conflicts, ensure smooth collaboration.
- System optimization: Optimize multi-agent system performance, improve coordination efficiency, enhance parallel processing capabilities.

## 🎯 **Quick Reference Commands**

### **Essential Multi-Agent Commands**
```powershell
# Start continuous multi-agent processing
.\scripts\multi-agent-automation.ps1 -Mode continuous -MaxIssues 10

# Monitor all agents
.\scripts\multi-agent-automation.ps1 -Mode monitor

# Process specific issue with optimal agent
.\scripts\multi-agent-automation.ps1 -Mode single-issue -Options 123

# Check agent coordination status
.\scripts\agent-coordinator.ps1 -Operation status

# Balance agent workload
.\scripts\agent-coordinator.ps1 -Operation balance-load

# Auto-assign issues to optimal agents
.\scripts\agent-coordinator.ps1 -Operation auto-assign -MaxIssues 5
```

### **Agent-Specific Commands**
```powershell
# Frontend agent workflow
.\scripts\multi-agent-automation.ps1 -Mode agent-workflow -Agent agent-frontend

# Content agent workflow
.\scripts\multi-agent-automation.ps1 -Mode agent-workflow -Agent agent-content

# Infrastructure agent workflow
.\scripts\multi-agent-automation.ps1 -Mode agent-workflow -Agent agent-infra

# Documentation agent workflow
.\scripts\multi-agent-automation.ps1 -Mode agent-workflow -Agent agent-docs

# Backend agent workflow
.\scripts\multi-agent-automation.ps1 -Mode agent-workflow -Agent agent-backend
```

### **System Management Commands**
```powershell
# Initialize multi-agent system
.\scripts\integrate-multi-agent.ps1 -Operation install

# Validate system health
.\scripts\integrate-multi-agent.ps1 -Operation validate

# Sync all work trees
.\scripts\multi-agent-worktree-system.ps1 -Operation sync

# Check system status
.\scripts\master-automation.ps1 -Mode status
```

This updated prompt system leverages the full power of your multi-agent automation system, providing intelligent coordination, parallel development, and comprehensive automation capabilities while maintaining the simplicity and effectiveness of your existing prompt system.


