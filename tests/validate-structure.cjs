const fs = require('fs');
const path = require('path');

const PLUGIN_ROOT = path.resolve(__dirname, '..');
const SKILLS_DIR = path.join(PLUGIN_ROOT, 'skills', 'perseus');
const SPECIALISTS_DIR = path.join(SKILLS_DIR, 'specialists');
const COMMANDS_DIR = path.join(PLUGIN_ROOT, 'commands');

const parseFrontmatter = (content) => {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const frontmatter = {};
  for (const line of match[1].split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx <= 0) continue;
    const key = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim().replace(/^['"]|['"]$/g, '');
    frontmatter[key] = value;
  }

  return frontmatter;
};

console.log('🔍 Validating Perseus Plugin Structure...\n');

// 1. Check Metadata Files
const requiredFiles = [
  'README.md',
  'LICENSE',
  '.claude-plugin/plugin.json',
  '.claude-plugin/marketplace.json',
  '.codex/manifest.json',
  '.opencode/manifest.json'
];

let errors = 0;
let passed = 0;
const skillNames = new Set();

console.log('📁 Checking Metadata Files...');
requiredFiles.forEach(file => {
  if (!fs.existsSync(path.join(PLUGIN_ROOT, file))) {
    console.error(`❌ Missing file: ${file}`);
    errors++;
  } else {
    console.log(`✅ Found: ${file}`);
    passed++;
  }
});

// 2. Validate Core Skills
console.log('\n🎯 Checking Core Skills...');
const coreSkills = ['scan', 'audit', 'exploit', 'report', 'start', 'using-perseus'];

coreSkills.forEach(skill => {
  const skillFile = path.join(SKILLS_DIR, skill, 'SKILL.md');
  if (!fs.existsSync(skillFile)) {
    console.error(`❌ Missing core skill: ${skill}`);
    errors++;
  } else {
    const content = fs.readFileSync(skillFile, 'utf8');
    const frontmatter = parseFrontmatter(content);
    if (!frontmatter || !frontmatter.name || !frontmatter.description) {
      console.error(`❌ Invalid Frontmatter in: ${skill}/SKILL.md`);
      errors++;
    } else {
      skillNames.add(frontmatter.name);
      console.log(`✅ Valid Core Skill: ${skill}`);
      passed++;
    }
  }
});

// 3. Validate Specialist Skills
console.log('\n🔬 Checking Specialist Skills...');
const specialistSkills = ['api', 'injection', 'crypto', 'supply-chain', 'file-security', 'logic', 'client', 'config', 'all'];

specialistSkills.forEach(skill => {
  const skillFile = path.join(SPECIALISTS_DIR, skill, 'SKILL.md');
  if (!fs.existsSync(skillFile)) {
    console.error(`❌ Missing specialist skill: ${skill}`);
    errors++;
  } else {
    const content = fs.readFileSync(skillFile, 'utf8');
    const frontmatter = parseFrontmatter(content);
    if (!frontmatter || !frontmatter.name || !frontmatter.description) {
      console.error(`❌ Invalid Frontmatter in specialist: ${skill}/SKILL.md`);
      errors++;
    } else {
      skillNames.add(frontmatter.name);
      console.log(`✅ Valid Specialist Skill: ${skill}`);
      passed++;
    }
  }
});

const validateCommand = (cmd, label) => {
  const cmdFile = path.join(COMMANDS_DIR, cmd);
  if (!fs.existsSync(cmdFile)) {
    console.error(`❌ Missing ${label} command: ${cmd}`);
    errors++;
    return;
  }

  const content = fs.readFileSync(cmdFile, 'utf8');
  const frontmatter = parseFrontmatter(content);
  if (!frontmatter || !frontmatter.name || !frontmatter.description || !frontmatter.skill) {
    console.error(`❌ Invalid Frontmatter in ${label} command: ${cmd} (require: name, description, skill)`);
    errors++;
    return;
  }

  if (!skillNames.has(frontmatter.skill)) {
    console.error(`❌ Command ${cmd} references missing skill: ${frontmatter.skill}`);
    errors++;
    return;
  }

  console.log(`✅ Valid ${label} Command: ${cmd}`);
  passed++;
};

// 4. Validate Commands (Short aliases)
console.log('\n⚡ Checking Short Commands...');
const shortCommands = ['scan.md', 'audit.md', 'exploit.md', 'report.md', 'start.md', 'specialist.md'];

shortCommands.forEach(cmd => {
  validateCommand(cmd, 'Short');
});

// 5. Validate Commands (Full perseus: prefix)
console.log('\n📜 Checking Perseus Commands...');
const perseusCommands = [
  'perseus:scan.md',
  'perseus:audit.md',
  'perseus:exploit.md',
  'perseus:report.md',
  'perseus:start.md',
  'perseus:specialist.md',
  'perseus:api.md',
  'perseus:injection.md',
  'perseus:crypto.md',
  'perseus:supply-chain.md',
  'perseus:file.md',
  'perseus:logic.md',
  'perseus:client.md',
  'perseus:config.md'
];

perseusCommands.forEach(cmd => {
  validateCommand(cmd, 'Perseus');
});

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 SUMMARY');
console.log('='.repeat(50));
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${errors}`);
console.log('='.repeat(50));

if (errors > 0) {
  console.error(`\n🛑 Validation FAILED with ${errors} errors.`);
  process.exit(1);
} else {
  console.log('\n✨ All checks passed! Perseus Plugin structure is valid.');
}
