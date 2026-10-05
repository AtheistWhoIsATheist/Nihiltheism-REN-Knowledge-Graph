# scripts/generate_artifacts.py
import re
import json
import os

HTML_CONTENT = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>JOURNAL314 Ω — Nihiltheistic Hypermap Visual</title>
<style>
:root {
  --ink: #f6f7ff;
  --muted: #b8bddf;
  --bg: #070711;
  --panel: #11112a;
  --node: #191959;
  --node2: #242477;
  --line: #5252ff;
  --accent: #b9b9ff;
  --leaf: #161626;
  --hit: #fff0a8;
  --hit-ink: #151515;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: var(--ink);
  background:
    radial-gradient(circle at top left, rgba(82,82,255,.28), transparent 35rem),
    radial-gradient(circle at bottom right, rgba(185,185,255,.18), transparent 34rem),
    var(--bg);
  line-height: 1.35;
}
header {
  position: sticky;
  top: 0;
  z-index: 10;
  padding: 1rem clamp(1rem, 3vw, 2rem);
  background: rgba(7,7,17,.84);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(185,185,255,.24);
}
h1 {
  margin: 0 0 .35rem;
  font-size: clamp(1.45rem, 3vw, 2.55rem);
  letter-spacing: -.03em;
}
.meta {
  color: var(--muted);
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  font-size: .95rem;
}
.controls {
  display: flex;
  gap: .65rem;
  flex-wrap: wrap;
  margin-top: .9rem;
}
button, input {
  border: 1px solid rgba(185,185,255,.32);
  border-radius: 999px;
  color: var(--ink);
  background: rgba(25,25,89,.72);
  padding: .65rem .9rem;
  font-size: .94rem;
}
button { cursor: pointer; }
button:hover { background: rgba(82,82,255,.35); }
input {
  min-width: min(100%, 22rem);
  outline: none;
}
main {
  padding: 1.25rem clamp(1rem, 3vw, 2rem) 3rem;
  max-width: 1400px;
  margin: 0 auto;
}
.map {
  display: grid;
  gap: 1rem;
}
details, .leaf {
  position: relative;
  margin: .45rem 0 .45rem 1rem;
  padding-left: 1rem;
  border-left: 2px solid rgba(82,82,255,.42);
}
summary, .leaf {
  list-style: none;
  border: 1px solid rgba(185,185,255,.22);
  border-radius: 14px;
  padding: .62rem .75rem;
  background: linear-gradient(135deg, rgba(25,25,89,.95), rgba(17,17,42,.95));
  box-shadow: 0 12px 30px rgba(0,0,0,.20);
}
summary {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: .75rem;
}
summary::-webkit-details-marker { display: none; }
summary::before {
  content: "+";
  display: inline-grid;
  place-items: center;
  flex: 0 0 1.35rem;
  width: 1.35rem;
  height: 1.35rem;
  border-radius: 50%;
  background: rgba(185,185,255,.18);
  color: var(--accent);
  font-weight: 700;
}
details[open] > summary::before { content: "–"; }
.children {
  margin-left: .25rem;
  padding-left: .25rem;
}
.root-node > summary {
  background: linear-gradient(135deg, var(--node), #2c2ca0);
  border-color: rgba(255,255,255,.28);
  font-size: 1.06rem;
}
.level-1 > summary { background: linear-gradient(135deg, #1c1c69, #151542); }
.level-2 > summary { background: linear-gradient(135deg, #20205e, #14142d); }
.level-3 > summary { background: linear-gradient(135deg, #1b1b4b, #121224); }
.level-4 > summary { background: linear-gradient(135deg, #17173a, #11111d); }
.leaf {
  background: rgba(22,22,38,.86);
  color: #e9eaff;
  margin-left: 2rem;
}
.node-label {
  overflow-wrap: anywhere;
}
.count {
  margin-left: auto;
  color: var(--muted);
  background: rgba(255,255,255,.08);
  border-radius: 999px;
  padding: .16rem .5rem;
  font-size: .78rem;
}
.match .node-label {
  background: var(--hit);
  color: var(--hit-ink);
  border-radius: .35rem;
  padding: .05rem .18rem;
}
.hidden-by-search { display: none; }
.footer-note {
  margin-top: 2rem;
  color: var(--muted);
  font-size: .95rem;
}
</style>
</head>
<body>
<header>
  <h1>JOURNAL314 Ω — Nihiltheistic Hypermap Visual</h1>
  <div class="meta">
    <span>2 unique root trees</span>
    <span>1808 preserved nodes</span>
    <span>Interactive collapsible view</span>
  </div>
  <div class="controls">
    <button onclick="setAll(true)">Expand all</button>
    <button onclick="setAll(false)">Collapse all</button>
    <input id="search" placeholder="Search the mindmap..." oninput="searchMap(this.value)">
  </div>
</header>
<main>
  <section class="map" id="map">
"""

print("Writing HTML generator...")
