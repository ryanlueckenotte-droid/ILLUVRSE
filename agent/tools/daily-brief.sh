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
