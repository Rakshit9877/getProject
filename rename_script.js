const fs = require('fs');
const path = require('path');

const rootDir = '/Users/rakshitjindal/Downloads/new_project';
const excludeDirs = ['node_modules', '.git', 'dist', '.gemini', '.vercel', 'build'];
const targetExtensions = ['.js', '.jsx', '.html', '.md', '.json', '.yaml', '.yml'];

let replacedFiles = [];

function replaceInFile(filePath) {
    let original = fs.readFileSync(filePath, 'utf8');
    let content = original;
    
    // Rebrand
    content = content.replace(/Astril Studio/g, 'Astril Studio');
    content = content.replace(/astril-studio/g, 'astril-studio');
    content = content.replace(/ASTRIL STUDIO/g, 'ASTRIL STUDIO');

    // Make copyright strictly "© 2026 Astril Studio. All rights reserved."
    content = content.replace(/©\s*\{new Date\(\)\.getFullYear\(\)\}\s*Astril Studio\.?\s*(All rights reserved\.)?/g, '© 2026 Astril Studio. All rights reserved.');
    
    // Specific package.json changes
    if (path.basename(filePath) === 'package.json' || path.basename(filePath) === 'package-lock.json') {
        const parentDir = path.basename(path.dirname(filePath));
        if (parentDir === 'client') {
            content = content.replace(/"name":\s*"[^"]+"/, '"name": "astril-studio-client"');
        } else if (parentDir === 'server') {
            content = content.replace(/"name":\s*"[^"]+"/, '"name": "astril-studio-server"');
        }
    }

    if (original !== content) {
        fs.writeFileSync(filePath, content, 'utf8');
        replacedFiles.push(filePath.replace(rootDir, ''));
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (excludeDirs.includes(file)) continue;
        
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            walkDir(fullPath);
        } else {
            const ext = path.extname(fullPath);
            if (targetExtensions.includes(ext) || file.includes('.env')) {
                replaceInFile(fullPath);
            }
        }
    }
}

walkDir(rootDir);
console.log('Replaced in ' + replacedFiles.length + ' files:');
replacedFiles.forEach(f => console.log(f));
