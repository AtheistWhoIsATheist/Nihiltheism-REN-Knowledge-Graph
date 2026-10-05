// scripts/setup-original-graph.js
const fs = require('fs');
const path = require('path');

// Extract all lines from prompt's HTML
// Let's create the canonical representation with full hierarchy, nodes, edges, labels, levels, and counts
console.log('Setting up original graph baseline...');
