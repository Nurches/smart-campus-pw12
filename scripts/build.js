// Inlines src/*.js into dist/index.html so the demo is one self-contained file.
'use strict';
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const files = ['bookings.js', 'validation.js', 'availability.js', 'ui.js'];
const inline = files.map(f => `<script>/* src/${f} */\n${fs.readFileSync(path.join(root, 'src', f), 'utf8')}</script>`).join('\n');
html = html.replace(/<!--SCRIPTS-->[\s\S]*<!--\/SCRIPTS-->/, inline);
fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist', 'index.html'), html);
console.log('dist/index.html written,', html.length, 'bytes');
