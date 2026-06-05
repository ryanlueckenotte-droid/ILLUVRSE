#!/usr/bin/env bash

cd "$HOME/ILLUVRSE"

if [ -z "$*" ]; then
  echo "Usage: ./agent/tools/add-memory.sh memory text here"
  exit 1
fi

echo "- $(date '+%Y-%m-%d %H:%M') - $*" >> agent/memory/timeline.md
echo "Memory saved."
