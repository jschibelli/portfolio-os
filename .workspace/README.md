# .workspace Directory - Personal Temporary Files

This directory is for **temporary, personal files only**. It's gitignored.

---

## ⚠️ Important: For Shared Files

**If you need files accessible to all agent worktrees:**

### Project Documentation
Put permanent project docs here (git-tracked):
```
docs/project-management/
```

### Project Scripts
Put reusable scripts here (git-tracked):
```
scripts/project-management/
```

---

## ✅ What Goes in `.workspace/`

- Personal scratch notes
- Temporary testing files
- Your own todo lists
- Local experimentation
- Anything you don't want committed

---

## ❌ What Does NOT Go Here

- Project planning documents → `docs/project-management/`
- Automation scripts → `scripts/project-management/`
- Anything other agents need to see
- Anything that should be version controlled

---

## 📁 Chatbot v1.1.0 Files Have Moved

Chatbot planning docs are now in:
```
docs/project-management/chatbot-v1.1.0/
```

Chatbot scripts are now in:
```
scripts/project-management/chatbot-v1.1.0/
```

These locations are git-tracked and accessible from all worktrees.

---

## 🔗 Access from Worktrees

Since this `.workspace/` is only in the main tree, files here are NOT accessible from agent worktrees. Use the git-tracked locations above for shared files.

---

**Last Updated:** October 20, 2025
