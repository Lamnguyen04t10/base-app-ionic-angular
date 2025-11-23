const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  bold: '\x1b[1m',
};

const spinnerFrames = ['|', '/', '-', '\\'];

function colorText(text, color, bold = false) {
  return (bold ? colors.bold : '') + (colors[color] || '') + text + colors.reset;
}

function showSpinner(message, icon = '⏳', color = 'cyan') {
  let i = 0;
  process.stdout.write('\n');

  const interval = setInterval(() => {
    const frame = spinnerFrames[i % spinnerFrames.length];
    const line = `${frame} ${icon} ${message}   `;
    process.stdout.write('\r' + colorText(line, color, true));
    i++;
  }, 120);

  return interval;
}

function stopSpinner(interval, success = true, message = '') {
  clearInterval(interval);
  const icon = success ? '✔️' : '❌';
  const color = success ? 'green' : 'red';
  const line = `${icon} ${message}`;
  process.stdout.write('\r' + ' '.repeat(process.stdout.columns || 80) + '\r');
  process.stdout.write(colorText(line, color, true) + '\n');
}

const componentName = process.argv[2];
if (!componentName) {
  console.error(colorText('❌ Please provide component name', 'red', true));
  process.exit(1);
}

const project = 'base';
const rootPath = 'src/app/components';
const componentDir = path.join(rootPath, componentName);
const tsFile = path.join(rootPath, `${componentName}.component.ts`);

const command = `ng g c components/${componentName} --prefix=${project}`;

const spinner = showSpinner('Generating your component...', '🚀', 'magenta');
const startTime = Date.now();
const minDuration = 5000;

exec(command, (error, stdout, stderr) => {
  const duration = Date.now() - startTime;

  function finish(success, msg) {
    stopSpinner(spinner, success, msg);

    if (!success) {
      console.error(stderr || error);
      process.exit(1);
    }

    if (fs.existsSync(componentDir)) {
      try {
        const files = fs.readdirSync(componentDir);
        const specFiles = files.filter((f) => f.endsWith('.spec.ts'));
        if (specFiles.length === 0) {
          console.log(colorText('ℹ️ No test file generated (good!)', 'yellow'));
        } else {
          specFiles.forEach((f) => {
            const full = path.join(componentDir, f);
            try {
              fs.unlinkSync(full);
              console.log(colorText(`🗑️  Removed test file: ${full}`, 'yellow'));
            } catch (unlinkErr) {
              console.warn(colorText(`⚠️ Failed to remove ${full}: ${unlinkErr.message}`, 'red'));
            }
          });
        }
      } catch (readErr) {
        console.warn(
          colorText(`⚠️ Could not read directory ${componentDir}: ${readErr.message}`, 'red'),
        );
      }
    } else {
      console.warn(
        colorText(`Folder ${componentDir} not found — cannot search for spec files`, 'red'),
      );
    }

    if (fs.existsSync(tsFile)) {
      let content = fs.readFileSync(tsFile, 'utf8');

      if (/standalone\s*:\s*(true|false)/m.test(content)) {
        content = content.replace(/standalone\s*:\s*(true|false)/m, 'standalone: false');
        fs.writeFileSync(tsFile, content, 'utf8');
        console.log(colorText(`Updated standalone to false`, 'cyan'));
      } else {
        const updated = content.replace(/@Component\s*\(\s*{([\s\S]*?)\n}\)/m, (match, inner) =>
          match.replace(inner, inner + '\n  standalone: false,'),
        );
        if (updated !== content) {
          fs.writeFileSync(tsFile, updated, 'utf8');
          console.log(colorText(`Added standalone: false`, 'cyan'));
        } else {
          console.warn(
            colorText('⚠️ Could not insert standalone (unexpected file format)', 'yellow'),
          );
        }
      }
    } else {
      // console.warn(colorText(`File ${tsFile} not found`, 'red'));
    }

    const typesDir = path.join(componentDir, 'types');
    const indexFile = path.join(typesDir, 'index.ts');

    try {
      if (!fs.existsSync(typesDir)) {
        fs.mkdirSync(typesDir);
        console.log(colorText(`📁 Created folder: ${typesDir}`, 'green'));
      }

      if (!fs.existsSync(indexFile)) {
        fs.writeFileSync(indexFile, '// export type YourTypeHere = {}\n', 'utf8');
        console.log(colorText(`📄 Created file: ${indexFile}`, 'green'));
      } else {
        console.log(colorText(`ℹ️ index.ts already exists`, 'yellow'));
      }
    } catch (err) {
      console.error(colorText(`❌ Failed to create types folder: ${err.message}`, 'red'));
    }
  }

  if (duration >= minDuration) {
    finish(!error, 'Component generated successfully! Happy coding! 🎉');
  } else {
    setTimeout(() => {
      finish(!error, 'Component generated successfully! Happy coding! 🎉');
    }, minDuration - duration);
  }
});
