const { execSync } = require('child_process');
const pageName = process.argv[2];
if (!pageName) {
  console.error('Please provide component name');
  process.exit(1);
}
const path = `pages/${pageName}`;
execSync(`ng g page ${path} --no-standalone`, { stdio: 'inherit' });