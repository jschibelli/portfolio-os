#!/bin/bash
set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== GitHub Project #20 Configuration Script ===${NC}"
echo "Starting configuration for Portfolio Site documentation management..."
echo

# 1) Sanity checks
echo -e "${YELLOW}1) Running sanity checks...${NC}"
echo "GitHub CLI version:"
gh --version

echo
echo "GitHub auth status:"
gh auth status

echo
echo "Current user:"
CURRENT_USER=$(gh api user --jq .login)
echo "User: $CURRENT_USER"

echo
# Set variables
PROJECT_NUMBER=20
OWNER="@me"
REPOS=("jschibelli/portfolio-os" "jschibelli/documentation-portfolio-os")

echo "Variables set:"
echo "  PROJECT_NUMBER=$PROJECT_NUMBER"
echo "  OWNER=$OWNER"
echo "  REPOS=${REPOS[*]}"
echo

# 2) Ensure Project fields exist
echo -e "${YELLOW}2) Ensuring Project fields exist...${NC}"

# Get existing fields
echo "Fetching existing project fields..."
EXISTING_FIELDS=$(gh project field-list --owner "$OWNER" --number $PROJECT_NUMBER --format json 2>/dev/null || echo "[]")

# Function to check if field exists
field_exists() {
    local field_name="$1"
    echo "$EXISTING_FIELDS" | jq -r --arg name "$field_name" '.[] | select(.name == $name) | .id' 2>/dev/null || echo ""
}

# Function to get field ID
field_id() {
    local field_name="$1"
    local fid=$(echo "$EXISTING_FIELDS" | jq -r --arg name "$field_name" '.[] | select(.name == $name) | .id' 2>/dev/null || echo "")
    if [ -z "$fid" ]; then
        echo "$EXISTING_FIELDS" | jq -r --arg name "$field_name" '.[] | select(.name == $name) | .id' 2>/dev/null || echo ""
    else
        echo "$fid"
    fi
}

# Function to get option ID for SINGLE_SELECT field
option_id() {
    local field_name="$1"
    local option_label="$2"
    echo "$EXISTING_FIELDS" | jq -r --arg field "$field_name" --arg option "$option_label" '.[] | select(.name == $field) | .options[]? | select(.name == $option) | .id' 2>/dev/null || echo ""
}

# Create fields if they don't exist
declare -A FIELD_IDS

# App field (SINGLE_SELECT)
if [ -z "$(field_exists "App")" ]; then
    echo "Creating App field..."
    FIELD_IDS[App]=$(gh project field-create --owner "$OWNER" --number $PROJECT_NUMBER --name "App" --single-select-option "Docs" --single-select-option "Portfolio Site" --single-select-option "Dashboard" --single-select-option "Chatbot" --format json --jq '.id')
    echo "  Created App field with ID: ${FIELD_IDS[App]}"
else
    FIELD_IDS[App]=$(field_exists "App")
    echo "  App field already exists with ID: ${FIELD_IDS[App]}"
fi

# Area field (SINGLE_SELECT)
if [ -z "$(field_exists "Area")" ]; then
    echo "Creating Area field..."
    FIELD_IDS[Area]=$(gh project field-create --owner "$OWNER" --number $PROJECT_NUMBER --name "Area" --single-select-option "Frontend" --single-select-option "Content" --single-select-option "Infra" --single-select-option "DX/Tooling" --format json --jq '.id')
    echo "  Created Area field with ID: ${FIELD_IDS[Area]}"
else
    FIELD_IDS[Area]=$(field_exists "Area")
    echo "  Area field already exists with ID: ${FIELD_IDS[Area]}"
fi

# Priority field (SINGLE_SELECT)
if [ -z "$(field_exists "Priority")" ]; then
    echo "Creating Priority field..."
    FIELD_IDS[Priority]=$(gh project field-create --owner "$OWNER" --number $PROJECT_NUMBER --name "Priority" --single-select-option "P0" --single-select-option "P1" --single-select-option "P2" --single-select-option "P3" --format json --jq '.id')
    echo "  Created Priority field with ID: ${FIELD_IDS[Priority]}"
else
    FIELD_IDS[Priority]=$(field_exists "Priority")
    echo "  Priority field already exists with ID: ${FIELD_IDS[Priority]}"
fi

# Estimate field (NUMBER)
if [ -z "$(field_exists "Estimate")" ]; then
    echo "Creating Estimate field..."
    FIELD_IDS[Estimate]=$(gh project field-create --owner "$OWNER" --number $PROJECT_NUMBER --name "Estimate" --number --format json --jq '.id')
    echo "  Created Estimate field with ID: ${FIELD_IDS[Estimate]}"
else
    FIELD_IDS[Estimate]=$(field_exists "Estimate")
    echo "  Estimate field already exists with ID: ${FIELD_IDS[Estimate]}"
fi

# Iteration field (ITERATION)
if [ -z "$(field_exists "Iteration")" ]; then
    echo "Creating Iteration field..."
    FIELD_IDS[Iteration]=$(gh project field-create --owner "$OWNER" --number $PROJECT_NUMBER --name "Iteration" --iteration --format json --jq '.id')
    echo "  Created Iteration field with ID: ${FIELD_IDS[Iteration]}"
else
    FIELD_IDS[Iteration]=$(field_exists "Iteration")
    echo "  Iteration field already exists with ID: ${FIELD_IDS[Iteration]}"
fi

echo

# 3) Ensure labels exist in both repos
echo -e "${YELLOW}3) Ensuring labels exist in both repositories...${NC}"

LABELS=(
    "app/docs" "app/portfolio-site" "app/dashboard" "app/chatbot"
    "type/feature" "type/chore" "type/bug" "type/docs"
    "area/content" "area/frontend" "area/infra" "area/dx"
)

for REPO in "${REPOS[@]}"; do
    echo "Processing repo: $REPO"
    for LABEL in "${LABELS[@]}"; do
        if gh label list --repo "$REPO" --json name --jq ".[] | select(.name == \"$LABEL\") | .name" | grep -q "^$LABEL$"; then
            echo "  Label '$LABEL' already exists"
        else
            echo "  Creating label '$LABEL'..."
            gh label create "$LABEL" --repo "$REPO" --color "6e7681" --description "$LABEL" || echo "    (Label may already exist)"
        fi
    done
done

echo

# 4) Helper functions
echo -e "${YELLOW}4) Defining helper functions...${NC}"

# Function to create and add issue to project
create_and_add_issue() {
    local repo="$1"
    local title="$2"
    local body_text="$3"
    local labels_csv="$4"
    local app_value="$5"
    local priority_value="${6:-P2}"
    local iteration_value="${7:-@current}"
    
    echo "Creating issue in $repo: $title"
    
    # Check if issue already exists
    local existing_issue=$(gh issue list --repo "$repo" --search "in:title \"$title\" state:open" --json number,url --jq '.[0]')
    
    local issue_url
    if [ "$existing_issue" != "null" ] && [ -n "$existing_issue" ]; then
        issue_url=$(echo "$existing_issue" | jq -r '.url')
        echo "  Reusing existing issue: $issue_url"
    else
        # Create new issue
        local temp_body=$(mktemp)
        echo "$body_text" > "$temp_body"
        
        issue_url=$(gh issue create --repo "$repo" --title "$title" --body-file "$temp_body" --label "$labels_csv" --format json --jq '.url')
        rm "$temp_body"
        echo "  Created new issue: $issue_url"
    fi
    
    # Add to project
    local project_item_id=$(gh project item-add --owner "$OWNER" --number $PROJECT_NUMBER --url "$issue_url" --format json --jq '.id')
    echo "  Added to project with item ID: $project_item_id"
    
    # Set fields
    local app_option_id=$(option_id "App" "$app_value")
    if [ -n "$app_option_id" ]; then
        gh project item-edit --id "$project_item_id" --field-id "${FIELD_IDS[App]}" --option-id "$app_option_id" || echo "    (App field may already be set)"
    fi
    
    local priority_option_id=$(option_id "Priority" "$priority_value")
    if [ -n "$priority_option_id" ]; then
        gh project item-edit --id "$project_item_id" --field-id "${FIELD_IDS[Priority]}" --option-id "$priority_option_id" || echo "    (Priority field may already be set)"
    fi
    
    if [ "$iteration_value" = "@current" ]; then
        gh project item-edit --id "$project_item_id" --field-id "${FIELD_IDS[Iteration]}" --value "@current" || echo "    (Iteration field may already be set)"
    fi
    
    echo "$issue_url|$project_item_id"
}

# Function to link dependencies
link_dependency() {
    local parent_issue_url="$1"
    local child_issue_url="$2"
    
    local parent_repo=$(echo "$parent_issue_url" | sed 's|.*github.com/\([^/]*/[^/]*\)/.*|\1|')
    local parent_number=$(echo "$parent_issue_url" | sed 's|.*/issues/\([0-9]*\)|\1|')
    
    echo "Linking dependency: $parent_issue_url -> $child_issue_url"
    
    # Try to add link directly
    if gh issue edit "$parent_number" --repo "$parent_repo" --add-link "$child_issue_url" 2>/dev/null; then
        echo "  Added direct link"
    else
        # Fallback: add to body as checklist item
        local current_body=$(gh issue view "$parent_number" --repo "$parent_repo" --json body --jq '.body')
        local dependency_text="- [ ] Depends on: $child_issue_url"
        
        if echo "$current_body" | grep -q "$dependency_text"; then
            echo "  Dependency link already exists in body"
        else
            local new_body="$current_body

$dependency_text"
            gh issue edit "$parent_number" --repo "$parent_repo" --body "$new_body" || echo "    (Failed to update body)"
            echo "  Added dependency to issue body"
        fi
    fi
}

echo "Helper functions defined"
echo

# 5) Seed initial Docs issues
echo -e "${YELLOW}5) Creating initial Docs issues...${NC}"

declare -A ISSUE_RESULTS

# Issue A: Information Architecture & Content Map
echo "Creating Issue A..."
ISSUE_A_BODY="Define doc sections for the Portfolio site: Overview, Case Studies, Projects, Tech Stack, Blog, Component Library, Deployment & CI, Changelog.

Deliverables:
- Create IA doc in this repo (e.g., \`/content/map.md\`).
- Create MDX stubs for each section under \`/content/sections/\`.

Acceptance:
- \`content/map.md\` committed with agreed IA.
- All section stubs exist with frontmatter."

ISSUE_A_RESULT=$(create_and_add_issue "jschibelli/documentation-portfolio-os" "Docs: Information Architecture & Content Map" "$ISSUE_A_BODY" "app/docs,type/docs,area/content" "Docs" "P2")
ISSUE_RESULTS["A"]="$ISSUE_A_RESULT"

# Issue B: MDX & Navigation Scaffolding
echo "Creating Issue B..."
ISSUE_B_BODY="Wire up MDX routing, sidebar/nav, and search for this docs repo.
Add \`README.md\` describing the authoring workflow.

Acceptance:
- Sidebar renders all IA sections.
- Search indexes titles/headings."

ISSUE_B_RESULT=$(create_and_add_issue "jschibelli/documentation-portfolio-os" "Docs: MDX & Navigation Scaffolding" "$ISSUE_B_BODY" "app/docs,type/feature,area/frontend" "Docs" "P2")
ISSUE_RESULTS["B"]="$ISSUE_B_RESULT"

# Issue C: Component Reference Sync
echo "Creating Issue C..."
ISSUE_C_BODY="Generate component reference pages (props tables + usage) by introspecting components from the monorepo (\`portfolio-os\`) at \`apps/site\` (and shared packages if present).

Acceptance:
- At least 5 core UI components documented with examples."

ISSUE_C_RESULT=$(create_and_add_issue "jschibelli/documentation-portfolio-os" "Docs: Component Reference Sync" "$ISSUE_C_BODY" "app/docs,type/feature,area/dx" "Docs" "P2")
ISSUE_RESULTS["C"]="$ISSUE_C_RESULT"

# Issue D: CI – Link & Reference Checks
echo "Creating Issue D..."
ISSUE_D_BODY="Add CI that fails PRs on broken internal links/images/anchors in docs.
Add a docs-focused PR template.

Acceptance:
- CI fails on broken refs.
- PR template present."

ISSUE_D_RESULT=$(create_and_add_issue "jschibelli/documentation-portfolio-os" "Docs: CI – Link & Reference Checks" "$ISSUE_D_BODY" "app/docs,type/chore,area/infra" "Docs" "P2")
ISSUE_RESULTS["D"]="$ISSUE_D_RESULT"

echo

# 6) Cross-repo touchpoints in monorepo
echo -e "${YELLOW}6) Creating cross-repo issues in monorepo...${NC}"

# Portfolio Site issue
echo "Creating Portfolio Site issue..."
PORTFOLIO_SITE_BODY="Add a \"Docs\" link to header/footer that points to the docs site.
Prepare a version badge hook (placeholder) that can show a UI package or app version next to Docs link.

Acceptance:
- Header/footer \"Docs\" links live.
- Version badge placeholder renders without errors (can be wired later)."

PORTFOLIO_SITE_RESULT=$(create_and_add_issue "jschibelli/portfolio-os" "Portfolio Site: Add global \"Docs\" link + version badge hook" "$PORTFOLIO_SITE_BODY" "app/portfolio-site,type/feature,area/frontend" "Portfolio Site" "P3")
ISSUE_RESULTS["PortfolioSite"]="$PORTFOLIO_SITE_RESULT"

# Dashboard issue
echo "Creating Dashboard issue..."
DASHBOARD_BODY="Add a contextual \"Docs\" link in the dashboard sidebar and Help/About screen.

Acceptance:
- Sidebar and Help/About include a working Docs link."

DASHBOARD_RESULT=$(create_and_add_issue "jschibelli/portfolio-os" "Dashboard: Add \"Docs\" link in sidebar/help" "$DASHBOARD_BODY" "app/dashboard,type/feature,area/frontend" "Dashboard" "P3")
ISSUE_RESULTS["Dashboard"]="$DASHBOARD_RESULT"

echo

# 7) Link dependencies
echo -e "${YELLOW}7) Linking dependencies...${NC}"

COMPONENT_SYNC_URL=$(echo "${ISSUE_RESULTS[C]}" | cut -d'|' -f1)
PORTFOLIO_SITE_URL=$(echo "${ISSUE_RESULTS[PortfolioSite]}" | cut -d'|' -f1)
DASHBOARD_URL=$(echo "${ISSUE_RESULTS[Dashboard]}" | cut -d'|' -f1)

link_dependency "$COMPONENT_SYNC_URL" "$PORTFOLIO_SITE_URL"
link_dependency "$COMPONENT_SYNC_URL" "$DASHBOARD_URL"

echo

# 8) Final summary
echo -e "${GREEN}=== CONFIGURATION COMPLETE ===${NC}"
echo

# Get project URL
PROJECT_URL=$(gh project view --owner "$OWNER" --number $PROJECT_NUMBER --format json --jq '.url')

echo -e "${BLUE}PROJECT INFORMATION:${NC}"
echo "Project URL: $PROJECT_URL"
echo "Project Number: $PROJECT_NUMBER"
echo "Owner: $OWNER"
echo

echo -e "${BLUE}PROJECT FIELDS:${NC}"
for field in "App" "Area" "Priority" "Estimate" "Iteration"; do
    echo "  $field: ${FIELD_IDS[$field]}"
done
echo

echo -e "${BLUE}LABELS CREATED:${NC}"
for repo in "${REPOS[@]}"; do
    echo "  $repo:"
    for label in "${LABELS[@]}"; do
        echo "    - $label"
    done
done
echo

echo -e "${BLUE}ISSUES CREATED:${NC}"
echo -e "${YELLOW}Documentation Repo (jschibelli/documentation-portfolio-os):${NC}"
for issue in "A" "B" "C" "D"; do
    result="${ISSUE_RESULTS[$issue]}"
    url=$(echo "$result" | cut -d'|' -f1)
    item_id=$(echo "$result" | cut -d'|' -f2)
    echo "  Issue $issue: $url (Project Item: $item_id)"
done

echo
echo -e "${YELLOW}Monorepo (jschibelli/portfolio-os):${NC}"
for issue in "PortfolioSite" "Dashboard"; do
    result="${ISSUE_RESULTS[$issue]}"
    url=$(echo "$result" | cut -d'|' -f1)
    item_id=$(echo "$result" | cut -d'|' -f2)
    echo "  $issue: $url (Project Item: $item_id)"
done
echo

echo -e "${BLUE}DEPENDENCY LINKS:${NC}"
echo "  Component Reference Sync -> Portfolio Site Docs Link"
echo "  Component Reference Sync -> Dashboard Docs Link"
echo

echo -e "${BLUE}RECOMMENDED PROJECT FILTERS:${NC}"
echo "  Docs – Board: field:App = Docs"
echo "  Docs – Sprint: field:App = Docs AND Iteration = @current"
echo "  Portfolio Site – Roadmap: field:App = Portfolio Site"
echo "  Dashboard – Sprint: field:App = Dashboard AND Iteration = @current"
echo

echo -e "${GREEN}Configuration completed successfully! 🎉${NC}"

