const fs = require('fs');
const path = require('path');

const directories = [
  path.join(__dirname, 'backend', 'src'),
  path.join(__dirname, 'frontend', 'src'),
  path.join(__dirname, 'admin', 'src')
];

const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2B50}\u{2728}]/gu;

function walk(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      results.push(file);
    }
  });
  return results;
}

let allFiles = [];
directories.forEach(dir => {
  allFiles = allFiles.concat(walk(dir));
});

let found = false;
allFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, index) => {
    if (emojiRegex.test(line)) {
      console.log(`${file}:${index + 1}: ${line.trim()}`);
      found = true;
    }
  });
});

if (!found) console.log('No emojis found.');
