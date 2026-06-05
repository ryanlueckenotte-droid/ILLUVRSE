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
