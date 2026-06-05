#!/usr/bin/env bash
set -e

echo "=== ILLUVRSE SETUP ==="

ILLUVRSE_DIR="$HOME/ILLUVRSE"

mkdir -p "$ILLUVRSE_DIR"
cd "$ILLUVRSE_DIR"

echo "Using folder: $ILLUVRSE_DIR"

echo ""
echo "Updating Ubuntu..."
sudo apt update

echo ""
echo "Installing required tools..."
sudo apt install -y \
  curl \
  git \
  nodejs \
  python3 \
  python3-pip \
  python3-venv \
  jq \
  nano \
  htop \
  unzip

echo ""
echo "Checking Node and npm..."
node -v
npm -v

echo ""
echo "Installing Ollama if missing..."
if ! command -v ollama >/dev/null 2>&1; then
  curl -fsSL https://ollama.com/install.sh | sh
else
  echo "Ollama already installed."
fi

echo ""
echo "Starting Ollama if needed..."
if ! curl -s http://127.0.0.1:11434/api/tags >/dev/null 2>&1; then
  nohup ollama serve > "$HOME/ollama.log" 2>&1 &
  sleep 5
fi

echo ""
echo "Checking Ollama..."
if ! curl -s http://127.0.0.1:11434/api/tags >/dev/null 2>&1; then
  echo "Ollama is not running."
  echo "Open another Ubuntu terminal and run:"
  echo "ollama serve"
  echo ""
  echo "Then rerun this script:"
  echo "cd ~/ILLUVRSE && ./setup-illuvrse-dev.sh"
  exit 1
fi

echo "Ollama is running."

echo ""
echo "Pulling local model..."
ollama pull llama3.2:3b

echo ""
echo "Creating ILLUVRSE folders..."
mkdir -p \
  agent/prompts \
  agent/memory \
  agent/tools \
  agent/logs \
  docs \
  app \
  scripts

echo ""
echo "Creating README..."
cat > README.md <<'EOF'
# ILLUVRSE

ILLUVRSE is Ryan's local-first AI Chief of Staff and all-in-one personal assistant.

## Stack

- Ollama
- llama3.2:3b
- Node.js / Next.js
- Python tools
- Local memory

## Goal

Build a private AI assistant that runs locally, avoids per-token cloud AI billing, and helps Ryan manage tasks, projects, coding, research, files, and future online workflows.
EOF

echo ""
echo "Creating Chief of Staff prompt..."
cat > agent/prompts/chief_of_staff.md <<'EOF'
You are ILLUVRSE, Ryan Lueckenotte's private local AI Chief of Staff.

Mission:
Help Ryan build ILLUVRSE, create apps, manage ideas, organize life, make money, learn faster, and execute consistently.

Personality:
- Direct
- Practical
- Creative
- Honest
- Execution-focused
- No fake hype
- No vague advice
- Push Ryan toward action

Core roles:
- Chief of Staff
- Personal assistant
- Project manager
- Product strategist
- Startup advisor
- Coding assistant
- Research assistant
- Content assistant
- Local knowledge manager

Rules:
- Prefer simple working systems over complex plans.
- Break big goals into next actions.
- Ask before destructive actions.
- Ask before sending messages, posting online, deleting files, spending money, or changing settings.
- Protect Ryan's privacy and credentials.
EOF

echo ""
echo "Creating memory files..."
cat > agent/memory/profile.md <<'EOF'
# Ryan Profile

Name: Ryan Lueckenotte
Project: ILLUVRSE
Goal: Build a private local AI Chief of Staff and all-in-one personal assistant.
Machine: Windows laptop running Ubuntu/WSL.
Runtime: Ollama
Model: llama3.2:3b
EOF

cat > agent/memory/goals.md <<'EOF'
# Goals

- Build ILLUVRSE into a local-first AI agent.
- Avoid per-token cloud AI billing.
- Use ILLUVRSE as Ryan's Chief of Staff.
- Build tools, apps, automations, and business ideas.
EOF

cat > agent/memory/tasks.md <<'EOF'
# Tasks

## Open

- [ ] Build the ILLUVRSE web app.
- [ ] Connect the app to Ollama.
- [ ] Add memory, tasks, and projects.
- [ ] Add safe approval system for tools.

## Completed
EOF

cat > agent/memory/projects.md <<'EOF'
# Projects

## ILLUVRSE

Status: Active

Goal: Build Ryan's local-first AI Chief of Staff.
EOF

cat > agent/memory/timeline.md <<'EOF'
# Timeline

- Ollama installed.
- llama3.2:3b pulled and tested.
- ILLUVRSE folder created.
EOF

echo ""
echo "Creating scripts..."
cat > scripts/check-ollama.sh <<'EOF'
#!/usr/bin/env bash

echo "Checking Ollama..."

if curl -s http://127.0.0.1:11434/api/tags >/dev/null 2>&1; then
  echo "Ollama is running."
  echo ""
  ollama list
else
  echo "Ollama is not running."
  echo "Start it with:"
  echo "ollama serve"
  exit 1
fi
EOF

cat > scripts/start-illuvrse.sh <<'EOF'
#!/usr/bin/env bash

cd "$HOME/ILLUVRSE"

if ! curl -s http://127.0.0.1:11434/api/tags >/dev/null 2>&1; then
  echo "Starting Ollama..."
  nohup ollama serve > "$HOME/ollama.log" 2>&1 &
  sleep 5
fi

if ! curl -s http://127.0.0.1:11434/api/tags >/dev/null 2>&1; then
  echo "Ollama failed to start. Run manually:"
  echo "ollama serve"
  exit 1
fi

PROMPT="$(cat agent/prompts/chief_of_staff.md)"
PROFILE="$(cat agent/memory/profile.md)"
GOALS="$(cat agent/memory/goals.md)"
TASKS="$(cat agent/memory/tasks.md)"
PROJECTS="$(cat agent/memory/projects.md)"

ollama run llama3.2:3b "$PROMPT

Memory:
$PROFILE

$GOALS

$TASKS

$PROJECTS

Start by greeting Ryan as ILLUVRSE, his Chief of Staff. Ask what he wants to execute next."
EOF

echo ""
echo "Creating tools..."
cat > agent/tools/add-memory.sh <<'EOF'
#!/usr/bin/env bash

cd "$HOME/ILLUVRSE"

if [ -z "$*" ]; then
  echo "Usage: ./agent/tools/add-memory.sh memory text here"
  exit 1
fi

echo "- $(date '+%Y-%m-%d %H:%M') - $*" >> agent/memory/timeline.md
echo "Memory saved."
EOF

cat > agent/tools/daily-brief.sh <<'EOF'
#!/usr/bin/env bash

cd "$HOME/ILLUVRSE"

echo "# ILLUVRSE Daily Brief"
echo ""
echo "Date: $(date)"
echo ""
echo "## Goals"
cat agent/memory/goals.md
echo ""
echo "## Tasks"
cat agent/memory/tasks.md
echo ""
echo "## Projects"
cat agent/memory/projects.md
echo ""
echo "## Timeline"
tail -20 agent/memory/timeline.md
EOF

chmod +x scripts/*.sh agent/tools/*.sh

echo ""
echo "Initializing git repo..."
if [ ! -d .git ]; then
  git init
fi

echo ""
echo "Creating .gitignore..."
cat > .gitignore <<'EOF'
node_modules/
.next/
.env
.env.*
*.log
.DS_Store
__pycache__/
.venv/
venv/
dist/
build/
EOF

echo ""
echo "Checking final setup..."
echo "Node: $(node -v)"
echo "npm: $(npm -v)"
echo "Python: $(python3 --version)"
echo "Git: $(git --version)"
echo ""
echo "Ollama models:"
ollama list

echo ""
echo "=== DONE ==="
echo "Everything is inside: $HOME/ILLUVRSE"
echo ""
echo "Run:"
echo "cd ~/ILLUVRSE"
echo "./scripts/check-ollama.sh"
echo "./scripts/start-illuvrse.sh"
