const fs = require('fs');
const path = require('path');

const PLUGIN_ROOT = path.resolve(__dirname, '..');
const SKILLS_DIR = path.join(PLUGIN_ROOT, 'skills', 'perseus');
const SPECIALISTS_DIR = path.join(SKILLS_DIR, 'specialists');
const COMMANDS_DIR = path.join(PLUGIN_ROOT, 'commands');

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
    if (!content.startsWith('---') || !content.includes('name:') || !content.includes('description:')) {
      console.error(`❌ Invalid Frontmatter in: ${skill}/SKILL.md`);
      errors++;
    } else {
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
    if (!content.startsWith('---') || !content.includes('name:') || !content.includes('description:')) {
      console.error(`❌ Invalid Frontmatter in specialist: ${skill}/SKILL.md`);
      errors++;
    } else {
      console.log(`✅ Valid Specialist Skill: ${skill}`);
      passed++;
    }
  }
});

// 4. Validate Commands (Short aliases)
console.log('\n⚡ Checking Short Commands...');
const shortCommands = ['scan.md', 'audit.md', 'exploit.md', 'report.md', 'start.md', 'specialist.md'];

shortCommands.forEach(cmd => {
  const cmdFile = path.join(COMMANDS_DIR, cmd);
  if (!fs.existsSync(cmdFile)) {
    console.error(`❌ Missing short command: ${cmd}`);
    errors++;
  } else {
    const content = fs.readFileSync(cmdFile, 'utf8');
    if (!content.startsWith('---') || !content.includes('description:')) {
      console.error(`❌ Invalid Frontmatter in command: ${cmd}`);
      errors++;
    } else {
      console.log(`✅ Valid Short Command: ${cmd}`);
      passed++;
    }
  }
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
  const cmdFile = path.join(COMMANDS_DIR, cmd);
  if (!fs.existsSync(cmdFile)) {
    console.error(`❌ Missing perseus command: ${cmd}`);
    errors++;
  } else {
    const content = fs.readFileSync(cmdFile, 'utf8');
    if (!content.startsWith('---') || !content.includes('description:')) {
      console.error(`❌ Invalid Frontmatter in command: ${cmd}`);
      errors++;
    } else {
      console.log(`✅ Valid Perseus Command: ${cmd}`);
      passed++;
    }
  }
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
