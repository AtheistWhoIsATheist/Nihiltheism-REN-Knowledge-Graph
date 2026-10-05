# scripts/assemble_html_and_canonical.py
import os
import re
import json

header = """<!doctype html>
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

footer = """  </section>
  <p class="footer-note">Tip: Use search to open matching branches automatically. The Markdown download keeps the same hierarchy for Xmind import.</p>
</main>
<script>
function setAll(open) {
  document.querySelectorAll('details').forEach(d => d.open = open);
}
function searchMap(q) {
  q = q.trim().toLowerCase();
  document.querySelectorAll('.match').forEach(el => el.classList.remove('match'));
  document.querySelectorAll('.hidden-by-search').forEach(el => el.classList.remove('hidden-by-search'));
  if (!q) return;
  const labels = Array.from(document.querySelectorAll('.node-label'));
  const matches = [];
  labels.forEach(label => {
    if (label.textContent.toLowerCase().includes(q)) {
      const holder = label.closest('details, .leaf');
      if (holder) {
        holder.classList.add('match');
        matches.push(holder);
        let p = holder.parentElement;
        while (p) {
          if (p.tagName && p.tagName.toLowerCase() === 'details') p.open = true;
          p = p.parentElement;
        }
      }
    }
  });
}
</script>
</body>
</html>
"""

# Read tree 1
with open('/tmp/tree1.html', 'r', encoding='utf-8') as f:
    tree1 = f.read()

# Let's extract the tree2 string from scripts/populate_tree2_full.py
with open('scripts/populate_tree2_full.py', 'r', encoding='utf-8') as f:
    t2_content = f.read()

# The remaining tree2 part is inside remaining = """..."""
m = re.search(r'remaining = """(.*?)"""', t2_content, re.DOTALL)
tree2_part = m.group(1) if m else ""
tree2 = """<details open class="level-0 root-node"><summary><span class="node-label">Thematic Cross-Cuts</span><span class="count">4</span></summary>
<div class="children">
<details open class="level-1 "><summary><span class="node-label">T1 Groundlessness</span><span class="count">5</span></summary>
<div class="children">
<details class="level-2 "><summary><span class="node-label">Philosophy</span><span class="count">1</span></summary>
<div class="children">
<details class="level-3 "><summary><span class="node-label">Key Concepts</span><span class="count">5</span></summary>
<div class="children">
<details class="level-4 "><summary><span class="node-label">Epistemology</span><span class="count">5</span></summary>
<div class="children">
<details class="level-5 "><summary><span class="node-label">Key Questions</span><span class="count">2</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Nature of Knowledge</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">What is knowledge?</span></div>
<div class="leaf level-6 "><span class="node-label">Distinction between belief and knowledge</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Sources of Knowledge</span><span class="count">3</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Experience and observation</span></div>
<div class="leaf level-6 "><span class="node-label">Reason and intuition</span></div>
<div class="leaf level-6 "><span class="node-label">Knowledge as socially constructed</span></div>
</div></details>
</div></details>
<details class="level-5 "><summary><span class="node-label">Justification of Knowledge</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Basic, self-evident beliefs as groundwork</span></div>
<div class="leaf level-6 "><span class="node-label">What constitutes a basic belief?</span></div>
<div class="leaf level-6 "><span class="node-label">Issues of circular reasoning</span></div>
<div class="leaf level-6 "><span class="node-label">Interconnected beliefs for support</span></div>
<div class="leaf level-6 "><span class="node-label">What defines coherence?</span></div>
<div class="leaf level-6 "><span class="node-label">Limitations of circularity</span></div>
<div class="leaf level-6 "><span class="node-label">Reliable methods yield true beliefs</span></div>
<div class="leaf level-6 "><span class="node-label">Determining reliable processes</span></div>
<div class="leaf level-6 "><span class="node-label">Balancing truth and belief</span></div>
<div class="leaf level-6 "><span class="node-label">Justification varies with context</span></div>
<div class="leaf level-6 "><span class="node-label">Impact of social and cultural factors</span></div>
<div class="leaf level-6 "><span class="node-label">Relativity of standards</span></div>
<div class="leaf level-6 "><span class="node-label">Knowledge formed through social interactions</span></div>
<div class="leaf level-6 "><span class="node-label">Subjectivity in belief formation</span></div>
<div class="leaf level-6 "><span class="node-label">The role of consensus</span></div>
<div class="leaf level-6 "><span class="node-label">Importance of intellectual virtues</span></div>
<div class="leaf level-6 "><span class="node-label">Defining virtues in knowledge contexts</span></div>
<div class="leaf level-6 "><span class="node-label">Relevance of character to truth</span></div>
<div class="leaf level-6 "><span class="node-label">Justification based on usefulness</span></div>
<div class="leaf level-6 "><span class="node-label">Practical vs. epistemic value</span></div>
<div class="leaf level-6 "><span class="node-label">Relationship between truth and utility</span></div>
<div class="leaf level-6 "><span class="node-label">Questions the possibility of certainty</span></div>
<div class="leaf level-6 "><span class="node-label">Addressing the limits of knowledge claims</span></div>
<div class="leaf level-6 "><span class="node-label">Reconciliation with common beliefs</span></div>
</div></details>
</div></details>
""" + tree2_part

full_html = header + "\n" + tree1 + "\n" + tree2 + "\n" + footer

with open('nihiltheism-ren-knowledge-graph.html', 'w', encoding='utf-8') as f:
    f.write(full_html)

print("Saved nihiltheism-ren-knowledge-graph.html. Length:", len(full_html))

from parse_html_nodes import parse_html_to_graph
nodes, edges = parse_html_to_graph(full_html)
print(f"Extracted {len(nodes)} nodes and {len(edges)} edges.")

os.makedirs('src/data', exist_ok=True)
with open('src/data/canonicalGraph.json', 'w', encoding='utf-8') as f:
    json.dump({
        "meta": {
            "title": "JOURNAL314 Ω — Nihiltheistic Hypermap Visual",
            "canonicalNodeCount": len(nodes),
            "canonicalEdgeCount": len(edges),
            "rootTrees": 2
        },
        "nodes": nodes,
        "edges": edges
    }, f, indent=2)

print("Saved src/data/canonicalGraph.json successfully.")
