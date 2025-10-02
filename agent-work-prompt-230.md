# AGENT WORK PROMPT

## Issue Details
**Title:** Content Migration & Sync (LOW)
**Body:** ## Overview
Create migration tools and sync system for existing Hashnode content.

## Current Issues
- No migration path from Hashnode
- No sync between platforms
- Missing content backup system
- No rollback capabilities

## Acceptance Criteria
- [ ] Create Hashnode to Dashboard migration tool
- [ ] Implement bidirectional sync system
- [ ] Add content backup functionality
- [ ] Create rollback system
- [ ] Add migration analytics
- [ ] Test migration with real content

## Technical Details
- Files: \^Gpps/dashboard/scripts/migration/\, \^Gpps/dashboard/lib/sync/\`n- Migration: GraphQL to Prisma conversion
- Sync: Webhook-based updates
**Labels:** enhancement, agent-backend

## Agent Instructions
You are the Backend Agent. Your task is to work on issue #230.

INSTRUCTIONS:
1. Read the issue details carefully
2. Create a branch for this issue
3. Implement the backend changes
4. Create a PR with proper conventional commits
5. Use the commit format: feat(api): <description>
6. Include Agent: agent-backend in commit trailers

WORKFLOW:
1. Checkout the issue branch
2. Analyze the requirements
3. Implement the solution
4. Test the changes
5. Commit with proper format
6. Push and create PR

Remember: You are working as agent-backend. Be thorough and professional.

## Your Task
Work on this issue as agent-backend. Follow the workflow above and implement the solution.

## Commit Format
Use this exact format for your commits:
`
<type>(<scope>): <description>

<optional body>

Agent: agent-backend
Issue: #230
`

## Next Steps
1. Read the issue carefully
2. Implement the solution
3. Test your changes
4. Commit with proper format
5. Push and create PR

You are now working as agent-backend. Begin implementation.
