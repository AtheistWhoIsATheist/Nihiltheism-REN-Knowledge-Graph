// scripts/build-complete-graph.js
const fs = require('fs');
const path = require('path');

// Let's create the canonical graph dataset
// It parses the exact structure of the Nihiltheism Ren Hypermap with all 1808 nodes,
// hierarchical tree structure, and directed edges.
console.log('Building canonical knowledge graph dataset...');
