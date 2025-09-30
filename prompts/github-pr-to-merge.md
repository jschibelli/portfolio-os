Automate end-to-end: <PR_URL>. Monitor reviews, analyze CR‑GPT, draft threaded replies, update Project Status, run checks, drive to merge.

**Use:** `.\scripts\pr-automation-unified.ps1 -PRNumber <PR_NUMBER> -Action all`

Universal PR Automation: <PR_NUMBER>. Configure project fields, monitor CR‑GPT, generate responses, check merge readiness, provide guidance.

**Available Actions:**
- `monitor` - Show PR status and watch for changes
- `analyze` - Analyze CR-GPT comments and generate report
- `respond` - Generate automated responses to CR-GPT comments
- `quality` - Run code quality checks (lint, type-check)
- `docs` - Update documentation
- `all` - Run all actions (recommended)