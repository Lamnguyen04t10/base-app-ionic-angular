const { execSync } = require('child_process');
const componentName = process.argv[2];
if (!componentName) {
  console.error('Please provide component name');
  process.exit(1);
}
const path = `components/${componentName}`;
execSync(`ng g c ${path}`, { stdio: 'inherit' });