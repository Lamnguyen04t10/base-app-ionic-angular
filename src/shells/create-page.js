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

const pageName = process.argv[2];
if (!pageName) {
  console.error(colorText('❌ Please provide page name', 'red', true));
  process.exit(1);
}

const pagePath = `src/app/pages/${pageName}`;
const tsFile = path.join(pagePath, `${pageName}.page.ts`);
const specFile = path.join(pagePath, `${pageName}.page.spec.ts`);
const project = `base`;

const command = `ng g page pages/${pageName} --prefix=${project}`;

const spinner = showSpinner('Generating your page...', '🚀', 'magenta');
const startTime = Date.now();

exec(command, (error, stdout, stderr) => {
  const duration = Date.now() - startTime;
  const minDuration = 5000;

  function finish(success, msg) {
    stopSpinner(spinner, success, msg);

    if (!success) {
      console.error(stderr || error);
      process.exit(1);
    }

    if (fs.existsSync(specFile)) {
      fs.unlinkSync(specFile);
      console.log(colorText(`🗑️  Removed test file: ${specFile}`, 'yellow'));
    }

    if (fs.existsSync(tsFile)) {
      let content = fs.readFileSync(tsFile, 'utf8');
      const standaloneMatch = content.match(/standalone\s*:\s*(true|false)/);

      if (standaloneMatch) {
        if (standaloneMatch[1] !== 'false') {
          content = content.replace(/standalone\s*:\s*(true|false)/, 'standalone: false');
          fs.writeFileSync(tsFile, content, 'utf8');
          console.log(colorText(`Updated standalone to false in ${tsFile}`, 'cyan'));
        } else {
          console.log(colorText(`standalone is already false in ${tsFile}`, 'yellow'));
        }
      } else {
        content = content.replace(/(@Component\s*\(\s*{)([\s\S]*?)(\n})/, (match, p1, p2, p3) => {
          if (/standalone\s*:/m.test(p2)) return match;
          return p1 + p2 + '\n  standalone: false,' + p3;
        });
        fs.writeFileSync(tsFile, content, 'utf8');
      }

    } else {
      console.warn(colorText(`File ${tsFile} not found`, 'red'));
    }
  }

  if (duration >= minDuration) {
    finish(!error, 'Page generated successfully! Happy coding! 🎉');
  } else {
    setTimeout(() => {
      finish(!error, 'Page generated successfully! Happy coding! 🎉');
    }, minDuration - duration);
  }
});
