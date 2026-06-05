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
