# Multi-Agent Automation Prompts

## Overview
Updated prompts for the Portfolio OS multi-agent automation system. These prompts leverage the new parallel development capabilities with specialized AI agents.

## 🚀 **Multi-Agent System Prompts**

### **Start Multi-Agent Processing**
```
Start multi-agent automation: Process up to 10 issues using the specialized agent system. Let the system automatically assign issues to the most suitable agent (Frontend, Content, Infrastructure, Documentation, or Backend) based on issue analysis and agent capabilities.
```

### **Monitor Agent System**
```
Monitor multi-agent system: Show me the current status of all agents, what they're working on, their workload, and any issues or bottlenecks. Provide real-time monitoring of the agent coordination system.
```

### **Process Specific Issue with Optimal Agent**
```
Process issue with optimal agent: Analyze issue #[NUMBER] and assign it to the most suitable agent based on content analysis, complexity assessment, and agent capabilities. Let the system choose the best agent and execute the complete workflow.
```

### **Balance Agent Workload**
```
Balance agent workload: Analyze current agent assignments and redistribute work to ensure optimal load balancing. Identify overloaded agents and suggest reassignments to improve system efficiency.
```

## 🎯 **Agent-Specific Prompts**

### **Frontend Agent**
```
Frontend agent workflow: Assign this issue to the Frontend Agent for React component development, UI/UX implementation, styling, and user interaction features. The agent specializes in modern frontend development practices.
```

### **Content Agent**
```
Content agent workflow: Assign this issue to the Content Agent for blog post creation, article writing, SEO optimization, and content management. The agent specializes in engaging content creation and documentation.
```

### **Infrastructure Agent**
```
Infrastructure agent workflow: Assign this issue to the Infrastructure Agent for CI/CD pipeline management, deployment automation, security implementation, and system operations. The agent specializes in DevOps and infrastructure management.
```

### **Documentation Agent**
```
Documentation agent workflow: Assign this issue to the Documentation Agent for technical documentation, API docs, user guides, and knowledge base management. The agent specializes in clear technical communication.
```

### **Backend Agent**
```
Backend agent workflow: Assign this issue to the Backend Agent for API development, database design, server logic, and backend services. The agent specializes in server-side development and data management.
```

## 🔄 **Continuous Processing Prompts**

### **Continuous Multi-Agent Processing**
```
Start continuous multi-agent processing: Automatically process multiple issues in parallel using the specialized agent system. Let agents work simultaneously on different aspects of the project while maintaining coordination and preventing conflicts.
```

### **Watch Mode Processing**
```
Watch mode multi-agent processing: Continuously monitor for new issues and automatically assign them to appropriate agents. Keep the system running to handle new work as it becomes available.
```

### **Queue-Based Processing**
```
Process agent queues: Manage and process issue queues for each agent type. Handle priority-based processing, dependency resolution, and workload balancing across all agent queues.
```

## 🎛️ **System Management Prompts**

### **System Health Check**
```
Multi-agent system health check: Perform comprehensive health check of the multi-agent system including agent status, work tree integrity, state synchronization, and system performance metrics.
```

### **Agent Configuration**
```
Configure agent system: Set up or modify agent configurations, work tree settings, assignment rules, and coordination parameters. Customize the system for specific project needs.
```

### **Work Tree Management**
```
Manage work trees: Create, sync, or clean up agent work trees. Ensure proper isolation and synchronization across all agent workspaces.
```

## 🔧 **Advanced Coordination Prompts**

### **Intelligent Issue Assignment**
```
Intelligent issue assignment: Analyze issue #[NUMBER] for complexity, required skills, dependencies, and optimal agent assignment. Provide detailed analysis and assignment recommendation with justification.
```

### **Agent Coordination**
```
Coordinate agents: Manage multi-agent coordination for complex projects requiring multiple agents. Handle dependencies, integration points, and workflow synchronization.
```

### **Conflict Resolution**
```
Resolve agent conflicts: Identify and resolve conflicts between agents working on related code. Coordinate integration and prevent merge conflicts.
```

## 📊 **Monitoring and Analytics Prompts**

### **Agent Performance Analysis**
```
Agent performance analysis: Analyze performance metrics for each agent including work completion rates, quality scores, efficiency metrics, and optimization opportunities.
```

### **System Analytics**
```
Multi-agent system analytics: Provide comprehensive analytics on system performance, agent utilization, issue processing efficiency, and overall automation effectiveness.
```

### **Quality Metrics**
```
Quality metrics analysis: Analyze code quality, test coverage, security metrics, and performance indicators across all agent work. Identify areas for improvement.
```

## 🚨 **Troubleshooting Prompts**

### **System Diagnostics**
```
Multi-agent system diagnostics: Diagnose system issues including agent failures, work tree problems, state synchronization issues, and coordination failures.
```

### **Agent Recovery**
```
Agent recovery procedures: Recover failed agents, restore work tree integrity, resolve state conflicts, and restart agent operations.
```

### **Performance Optimization**
```
Optimize multi-agent system: Identify performance bottlenecks, optimize agent assignments, improve workflow efficiency, and enhance system scalability.
```

## 🔄 **Integration Prompts**

### **GitHub Integration**
```
GitHub multi-agent integration: Integrate multi-agent system with GitHub workflows, project boards, and issue management. Ensure seamless coordination with existing GitHub automation.
```

### **CI/CD Integration**
```
CI/CD multi-agent integration: Integrate agent work with CI/CD pipelines, automated testing, and deployment processes. Coordinate agent work with build and deployment automation.
```

### **Project Board Integration**
```
Project board multi-agent integration: Sync agent work with project board status, issue tracking, and progress monitoring. Maintain real-time project visibility.
```

## 📋 **Quick Reference Commands**

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

## 🎯 **Best Practices**

### **Issue Creation for Multi-Agent System**
- **Be Specific**: Clearly describe what needs to be done
- **Include Context**: Provide background and requirements
- **Set Expectations**: Define acceptance criteria
- **Use Templates**: Follow consistent issue formats

### **Agent Assignment Strategy**
- **Trust the System**: Let the system choose optimal agents
- **Monitor Workload**: Ensure balanced agent utilization
- **Review Assignments**: Verify agent assignments make sense
- **Adjust as Needed**: Modify configurations based on results

### **Quality Assurance**
- **Monitor Progress**: Track agent work and quality
- **Review Results**: Check completed work before merging
- **Provide Feedback**: Give feedback through review system
- **Optimize Continuously**: Improve system based on results

## 🔍 **Troubleshooting**

### **Common Issues**
- **Agents not responding**: Check system health and restart if needed
- **Work not assigned**: Verify agent capacity and configuration
- **Conflicts between agents**: Use coordination tools to resolve
- **Quality issues**: Review agent configurations and quality gates

### **Diagnostic Commands**
```powershell
# System health check
.\scripts\integrate-multi-agent.ps1 -Operation validate

# Agent status check
.\scripts\multi-agent-worktree-system.ps1 -Operation status

# Workload analysis
.\scripts\agent-coordinator.ps1 -Operation balance-load

# Performance monitoring
.\scripts\project-status-monitor.ps1 -Options "performance-analysis"
```

This updated prompt system leverages the full power of your multi-agent automation system, providing intelligent coordination, parallel development, and comprehensive automation capabilities.


