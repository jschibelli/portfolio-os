# Root Directory Scripts Analysis

## 📊 **Scripts Found in Root Directory**

### **PowerShell Scripts (17 files)**
- `add-all-issues-to-project.ps1` - Add all issues to project
- `add-and-configure-blog-issues.ps1` - Configure blog issues
- `add-and-set-status-ready.ps1` - Set status to ready
- `add-blog-issues-to-project.ps1` - Add blog issues to project
- `add-issues-to-project.ps1` - Add issues to project
- `add-labels-milestone-to-all-issues.ps1` - Add labels and milestones
- `configure-all-blog-issues.ps1` - Configure all blog issues
- `configure-blog-issues.ps1` - Configure blog issues
- `configure-blog-issues-complete.ps1` - Complete blog configuration
- `configure-project-fields-manual.ps1` - Manual project field configuration
- `create-remaining-issues.ps1` - Create remaining issues
- `rename-branches-with-issue-numbers.ps1` - Rename branches
- `set-all-issues-status-ready.ps1` - Set all issues to ready status
- `set-project-status-direct.ps1` - Set project status directly
- `set-status-ready-cli.ps1` - Set status ready via CLI
- `update-issue-branch-names.ps1` - Update issue branch names
- `update-issue-branch-names-simple.ps1` - Simple branch name updates

### **JavaScript Files (4 files)**
- `prettier.config.js` - Prettier configuration ✅ **KEEP** (config file)
- `test-api-functions.js` - API function tests ❌ **REMOVE** (test file)
- `test-blog-minimal.js` - Minimal blog tests ❌ **REMOVE** (test file)
- `test-blog-routing.js` - Blog routing tests ❌ **REMOVE** (test file)

### **Shell Scripts (1 file)**
- `configure_project_20.sh` - Project configuration script ❌ **EVALUATE**

---

## 🔍 **Analysis Categories**

### **✅ KEEP (1 file)**
- `prettier.config.js` - Configuration file, belongs in root

### **📁 MOVE TO SCRIPTS (15 files)**
These are all project management and automation scripts that belong in `/scripts/`:
- All `add-*` scripts (issue/project management)
- All `configure-*` scripts (project configuration)
- All `set-*` scripts (status management)
- All `update-*` scripts (branch management)
- `create-remaining-issues.ps1`
- `rename-branches-with-issue-numbers.ps1`

### **🗑️ REMOVE (4 files)**
- `test-api-functions.js` - Test file, should be in test directory
- `test-blog-minimal.js` - Test file, should be in test directory  
- `test-blog-routing.js` - Test file, should be in test directory
- `configure_project_20.sh` - Evaluate if still needed

---

## 🧹 **Cleanup Plan**

### **Phase 1: Move Useful Scripts**
Move 15 PowerShell scripts from root to `/scripts/` directory:
- All project management scripts
- All configuration scripts
- All status management scripts

### **Phase 2: Remove Test Files**
Remove 3 JavaScript test files from root:
- These belong in test directories, not root

### **Phase 3: Evaluate Shell Script**
Check if `configure_project_20.sh` is still needed:
- If outdated, remove
- If useful, move to appropriate location

### **Phase 4: Update Documentation**
- Update `/scripts/README.md` with new scripts
- Document script purposes and usage

---

## 📂 **Expected Final Structure**

### **Root Directory**
- `prettier.config.js` ✅ (configuration file)

### **`/scripts/` Directory**
- Existing 4 scripts ✅
- 15 moved scripts from root ✅
- **Total: 19 scripts**

### **Files Removed**
- 3 test JavaScript files
- 1 shell script (if outdated)

---

## 🎯 **Benefits**

### **Organization**
- ✅ **Clean root directory** - Only configuration files
- ✅ **Centralized scripts** - All scripts in `/scripts/` directory
- ✅ **Proper separation** - Config vs scripts vs tests

### **Maintainability**
- ✅ **Easy to find** - All scripts in one location
- ✅ **Clear purpose** - Each script has documented purpose
- ✅ **Consistent structure** - Follows project organization

### **Developer Experience**
- ✅ **Faster navigation** - No clutter in root
- ✅ **Better workflow** - Clear script organization
- ✅ **Reduced confusion** - Proper file placement
