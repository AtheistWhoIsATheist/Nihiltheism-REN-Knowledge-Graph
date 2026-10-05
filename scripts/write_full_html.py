# scripts/write_full_html.py
import sys
import os

part1_path = '/nihiltheism-ren-knowledge-graph.html'

# Let's verify and write the rest of the HTML
print("Reading current file...")
with open(part1_path, 'r', encoding='utf-8') as f:
    current = f.read()

print("Current length:", len(current))
