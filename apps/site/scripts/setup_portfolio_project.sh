#!/bin/bash

# Portfolio Project Setup Script for GitHub Projects v2
# Creates a comprehensive project board for schibelli.dev portfolio

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
OWNER="jschibelli"
PROJECT_TITLE="Portfolio Site — schibelli.dev"
PROJECT_DESCRIPTION="Central board for the schibelli.dev portfolio (Next.js, TypeScript, Tailwind)"
CACHE_FILE=".project_cache.json"

# Helper functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check for required tools
check_dependencies() {
    log_info "Checking dependencies..."
    
    if ! command -v gh &> /dev/null; then
        log_error "GitHub CLI (gh) is not installed"
        echo "Install with: brew install gh (macOS) or https://cli.github.com/"
        exit 1
    fi
    
    if ! command -v jq &> /dev/null; then
        log_error "jq is not installed"
        echo "Install with: brew install jq (macOS) or apt-get install jq (Ubuntu)"
        exit 1
    fi
    
    log_success "All dependencies found"
}

# Check GitHub CLI authentication and scopes
check_auth() {
    log_info "Checking GitHub CLI authentication..."
    
    if ! gh auth status &> /dev/null; then
        log_error "Not authenticated with GitHub CLI"
        echo "Run: gh auth login"
        exit 1
    fi
    
    # Check for required scopes
    local scopes=$(gh auth status --show-token 2>/dev/null | grep -o 'read:org\|project\|repo' | sort -u | tr '\n' ' ')
    if [[ ! "$scopes" =~ "read:org" ]] || [[ ! "$scopes" =~ "project" ]] || [[ ! "$scopes" =~ "repo" ]]; then
        log_warning "Missing required scopes. Current scopes: $scopes"
        echo "Required: read:org, project, repo"
        echo "Run: gh auth refresh -s read:org,project,repo"
        exit 1
    fi
    
    log_success "Authentication verified with required scopes"
}

# Get or create project
get_or_create_project() {
    log_info "Getting or creating project..."
    
    # Check if project already exists
    local existing_projects=$(gh project list --owner "$OWNER" --format json 2>/dev/null || echo "[]")
    local project_number=$(echo "$existing_projects" | jq -r --arg title "$PROJECT_TITLE" '.[] | select(.title == $title) | .number // empty')
    
    if [[ -n "$project_number" ]]; then
        log_success "Found existing project: #$project_number"
        echo "$project_number"
        return
    fi
    
    # Create new project
    log_info "Creating new project..."
    local project_data=$(gh project create --owner "$OWNER" --title "$PROJECT_TITLE" --format json)
    local project_number=$(echo "$project_data" | jq -r '.number')
    local project_url=$(echo "$project_data" | jq -r '.url')
    
    log_success "Created project #$project_number"
    echo "$project_number"
    
    # Cache project info
    echo "{\"number\": $project_number, \"url\": \"$project_url\"}" > "$CACHE_FILE"
}

# Set project README
set_project_readme() {
    local project_number="$1"
    log_info "Setting project README..."
    
    # Create temporary README file
    local readme_file=$(mktemp)
    cat > "$readme_file" << 'EOF'
# schibelli.dev — Portfolio Project

Central board for the schibelli.dev portfolio (Next.js, TypeScript, Tailwind).

## Status workflow

Backlog → Planned → In Progress → In Review → Done

## Fields

* Status (Backlog, Planned, In Progress, In Review, Done)
* Priority (P0, P1, P2, P3)
* Type (Feature, Bug, Chore, Docs)
* Area (Core, Blog, SEO, Accessibility, UI/Design, Infra)
* Size (XS, S, M, L, XL)
* Target (text)

## Views

* Board (grouped by Status)
* Table (open items, sorted by Priority then Size)
* Roadmap (optional: group by Target)

## Automation

* New items → Status = Backlog
* Closed issues / merged PRs → Status = Done
EOF
    
    # Set README
    gh project edit "$project_number" --owner "$OWNER" --readme-file "$readme_file"
    rm "$readme_file"
    
    log_success "Project README set"
}

# Create custom fields
create_fields() {
    local project_number="$1"
    log_info "Creating custom fields..."
    
    # Status field
    gh project field-create "$project_number" --owner "$OWNER" --name "Status" --type SINGLE_SELECT --options "Backlog,Planned,In Progress,In Review,Done"
    log_success "Created Status field"
    
    # Priority field
    gh project field-create "$project_number" --owner "$OWNER" --name "Priority" --type SINGLE_SELECT --options "P0,P1,P2,P3"
    log_success "Created Priority field"
    
    # Type field
    gh project field-create "$project_number" --owner "$OWNER" --name "Type" --type SINGLE_SELECT --options "Feature,Bug,Chore,Docs"
    log_success "Created Type field"
    
    # Area field
    gh project field-create "$project_number" --owner "$OWNER" --name "Area" --type SINGLE_SELECT --options "Core,Blog,SEO,Accessibility,UI/Design,Infra"
    log_success "Created Area field"
    
    # Size field
    gh project field-create "$project_number" --owner "$OWNER" --name "Size" --type SINGLE_SELECT --options "XS,S,M,L,XL"
    log_success "Created Size field"
    
    # Target field (text)
    gh project field-create "$project_number" --owner "$OWNER" --name "Target" --type TEXT
    log_success "Created Target field"
}

# Create views (if supported)
create_views() {
    local project_number="$1"
    log_info "Attempting to create views..."
    
    # Try to create board view
    if gh project view-create "$project_number" --owner "$OWNER" --name "Board" --format json &> /dev/null; then
        log_success "Created Board view"
    else
        log_warning "Board view creation not supported via CLI"
    fi
    
    # Try to create table view
    if gh project view-create "$project_number" --owner "$OWNER" --name "Table" --format json &> /dev/null; then
        log_success "Created Table view"
    else
        log_warning "Table view creation not supported via CLI"
    fi
}

# Setup GitHub secrets for workflow
setup_secrets() {
    local project_url="$1"
    
    log_info "Setting up GitHub secrets for workflow..."
    
    # Get project URL from cache if not provided
    if [[ -z "$project_url" && -f "$CACHE_FILE" ]]; then
        project_url=$(jq -r '.url' "$CACHE_FILE")
    fi
    
    if [[ -z "$project_url" ]]; then
        log_warning "Project URL not found. Please provide it manually."
        read -p "Enter project URL: " project_url
    fi
    
    # Set project URL secret
    gh secret set PORTFOLIO_PROJECT_URL --body "$project_url"
    log_success "Set PORTFOLIO_PROJECT_URL secret"
    
    # Prompt for PAT
    echo -n "Enter GitHub Personal Access Token (with Projects: Write scope): "
    read -s pat_token
    echo
    
    if [[ -n "$pat_token" ]]; then
        gh secret set PORTFOLIO_PROJECT_TOKEN --body "$pat_token"
        log_success "Set PORTFOLIO_PROJECT_TOKEN secret"
    else
        log_warning "No PAT provided. You'll need to set PORTFOLIO_PROJECT_TOKEN manually."
        echo "Create a fine-grained PAT with 'Projects: Write' scope at:"
        echo "https://github.com/settings/personal-access-tokens/fine-grained"
    fi
}

# Seed example items
seed_example_items() {
    local project_number="$1"
    
    log_info "Would you like to seed some example items? (y/N)"
    read -r response
    
    if [[ "$response" =~ ^[Yy]$ ]]; then
        log_info "Creating example issues..."
        
        # Create example feature issue
        local feature_issue=$(gh issue create --title "Add dark mode toggle" --body "Implement a dark mode toggle for the portfolio site" --label "feature" --format json)
        local feature_url=$(echo "$feature_issue" | jq -r '.url')
        gh project item-add "$project_number" --owner "$OWNER" --url "$feature_url"
        log_success "Added feature example"
        
        # Create example bug issue
        local bug_issue=$(gh issue create --title "Fix mobile navigation menu" --body "Navigation menu doesn't close properly on mobile devices" --label "bug" --format json)
        local bug_url=$(echo "$bug_issue" | jq -r '.url')
        gh project item-add "$project_number" --owner "$OWNER" --url "$bug_url"
        log_success "Added bug example"
        
        # Create example docs issue
        local docs_issue=$(gh issue create --title "Update README with setup instructions" --body "Add comprehensive setup instructions to the main README" --label "documentation" --format json)
        local docs_url=$(echo "$docs_issue" | jq -r '.url')
        gh project item-add "$project_number" --owner "$OWNER" --url "$docs_url"
        log_success "Added documentation example"
    fi
}

# Print summary and next steps
print_summary() {
    local project_number="$1"
    local project_url="$2"
    
    echo
    log_success "Portfolio Project Setup Complete!"
    echo
    echo "📊 Project Details:"
    echo "   Number: #$project_number"
    echo "   URL: $project_url"
    echo
    echo "🔧 Next Steps (if not done via CLI):"
    echo "   1. Open the Project → ⚙️ Settings → Workflows"
    echo "      → Enable 'Auto-add to Backlog' and 'Item closed → Status: Done'"
    echo
    echo "   2. Open the Project → Views → New view"
    echo "      → Board (group by Status)"
    echo "      → Table (filter is:open; sort Priority asc, Size asc)"
    echo
    echo "📁 Files Created:"
    echo "   - .github/ISSUE_TEMPLATE/feature_request.yml"
    echo "   - .github/ISSUE_TEMPLATE/bug_report.yml"
    echo "   - .github/ISSUE_TEMPLATE/config.yml"
    echo "   - .github/workflows/add-to-project.yml"
    echo "   - $CACHE_FILE"
    echo
    log_info "Run 'gh project view $project_number --owner $OWNER' to open the project"
}

# Main execution
main() {
    echo "🚀 Setting up Portfolio Project for GitHub Projects v2"
    echo "=================================================="
    echo
    
    check_dependencies
    check_auth
    
    local project_number=$(get_or_create_project)
    local project_url=""
    
    # Get project URL
    if [[ -f "$CACHE_FILE" ]]; then
        project_url=$(jq -r '.url' "$CACHE_FILE")
    else
        local project_data=$(gh project view "$project_number" --owner "$OWNER" --format json)
        project_url=$(echo "$project_data" | jq -r '.url')
        echo "{\"number\": $project_number, \"url\": \"$project_url\"}" > "$CACHE_FILE"
    fi
    
    set_project_readme "$project_number"
    create_fields "$project_number"
    create_views "$project_number"
    
    # Setup secrets
    log_info "Setting up GitHub secrets..."
    setup_secrets "$project_url"
    
    # Seed examples
    seed_example_items "$project_number"
    
    print_summary "$project_number" "$project_url"
}

# Run main function
main "$@"
