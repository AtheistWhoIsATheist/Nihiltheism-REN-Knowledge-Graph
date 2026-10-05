// scripts/package-and-verify.ts
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const workspaceRoot = process.cwd();
const releaseDir = path.resolve(workspaceRoot, 'release_staging');
const zipOutput = path.resolve(workspaceRoot, 'nihiltheism-ren-knowledge-graph-final.zip');
const testExtractDir = '/tmp/nihiltheism_clean_extraction_test';

console.log('--- PHASE 23 & 24: PACKAGING & CLEAN-EXTRACTION GATE ---');

// 1. Clean previous staging
if (fs.existsSync(releaseDir)) {
  fs.rmSync(releaseDir, { recursive: true, force: true });
}
if (fs.existsSync(zipOutput)) {
  fs.rmSync(zipOutput, { force: true });
}
if (fs.existsSync(testExtractDir)) {
  fs.rmSync(testExtractDir, { recursive: true, force: true });
}

fs.mkdirSync(releaseDir, { recursive: true });

// 2. Files to include in clean release
const filesToCopy = [
  'server.ts',
  'package.json',
  'tsconfig.json',
  'vite.config.ts',
  'index.html',
  'metadata.json',
  '.env.example',
  '.gitignore',
  'nihiltheism-ren-knowledge-graph.html'
];

const dirsToCopy = [
  'src',
  'tests'
];

console.log('Copying release files to staging directory...');
for (const file of filesToCopy) {
  const src = path.resolve(workspaceRoot, file);
  const dest = path.resolve(releaseDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
  }
}

function copyDirRecursive(src: string, dest: string) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

for (const dir of dirsToCopy) {
  const src = path.resolve(workspaceRoot, dir);
  const dest = path.resolve(releaseDir, dir);
  if (fs.existsSync(src)) {
    copyDirRecursive(src, dest);
  }
}

// Create README.md for the package
const readmeContent = `# Nihiltheism REN Knowledge Graph & Ingestion System

Interactive Nihiltheistic Hypermap & Knowledge Graph application featuring 730 preserved canonical nodes across 2 root branches, coupled with a multi-format bulk file ingestion system (.md, .txt, .pdf, .json, .csv), force-directed cosmic visualizer, and deterministic duplicate safety.

## Run Instructions
1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
2. Start the dev server:
   \`\`\`bash
   npm run dev
   \`\`\`
3. Run automated verification suite:
   \`\`\`bash
   npm test
   \`\`\`
4. Build for production:
   \`\`\`bash
   npm run build
   \`\`\`

## Invariant Ledger
- **P-001—P-005**: 100% Intact canonical corpus & topological hierarchy
- **IV1—IV16**: Multi-format ingestion, SHA-256 deduplication, atomic failure isolation
`;

fs.writeFileSync(path.resolve(releaseDir, 'README.md'), readmeContent, 'utf-8');

// 3. Zip staging directory using python packager
console.log('Creating final release ZIP archive...');
execSync(`python3 "${path.resolve(workspaceRoot, 'scripts/packager.py')}" zip "${releaseDir}" "${zipOutput}"`, { stdio: 'inherit' });

const zipStats = fs.statSync(zipOutput);
console.log(`Release archive created: ${zipOutput} (${(zipStats.size / 1024).toFixed(1)} KB)`);

// 4. CLEAN-EXTRACTION TEST (Release Gate 24)
console.log('\n--- CLEAN-EXTRACTION VERIFICATION GATE ---');
fs.mkdirSync(testExtractDir, { recursive: true });
execSync(`python3 "${path.resolve(workspaceRoot, 'scripts/packager.py')}" unzip "${zipOutput}" "${testExtractDir}"`, { stdio: 'inherit' });

// Verify critical files in extracted directory
const extractedHtml = path.resolve(testExtractDir, 'nihiltheism-ren-knowledge-graph.html');
const extractedCanonical = path.resolve(testExtractDir, 'src/data/canonicalGraph.json');
const extractedPkg = path.resolve(testExtractDir, 'package.json');

if (!fs.existsSync(extractedHtml) || !fs.existsSync(extractedCanonical) || !fs.existsSync(extractedPkg)) {
  console.error('FAIL: Missing critical files in extracted archive!');
  process.exit(1);
}

console.log('✓ Extracted archive contains all critical files.');
console.log('✓ nihiltheism-ren-knowledge-graph.html size:', fs.statSync(extractedHtml).size, 'bytes');
console.log('✓ canonicalGraph.json size:', fs.statSync(extractedCanonical).size, 'bytes');

// Clean staging dir
fs.rmSync(releaseDir, { recursive: true, force: true });
console.log('Clean-extraction test PASSED completely!\n');
