const fs = require('fs');
const path = require('path');

const dir = 'src/app/pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

let totalFixed = 0;

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Check Loader
  if (content.includes('<Loader') && !content.includes('Loader') && !content.match(/import\s+.*Loader.*from/)) {
    // wait, if it uses <Loader, it has the word Loader.
  }

  // A safer check:
  const usesLoader = content.includes('<Loader');
  const hasLoaderImport = content.includes('Loader') && content.match(/import\s+.*\{[^}]*Loader[^}]*\}.*from\s+["']@\/app\/components\/ui\/Shared["']/);

  if (usesLoader && !hasLoaderImport) {
    // We need to add Loader to the Shared import
    const sharedImportRegex = /import\s+\{([^}]+)\}\s+from\s+["']@\/app\/components\/ui\/Shared["']/;
    const match = content.match(sharedImportRegex);
    if (match) {
      if (!match[1].includes('Loader')) {
        const newImport = match[0].replace(match[1], match[1] + ', Loader');
        content = content.replace(sharedImportRegex, newImport);
        changed = true;
        console.log(`Added Loader import to ${file}`);
      }
    } else {
      content = 'import { Loader } from "@/app/components/ui/Shared";\n' + content;
      changed = true;
      console.log(`Created new Shared import for Loader in ${file}`);
    }
  }

  // Check useConfirm
  const usesConfirm = content.includes('useConfirm');
  const hasConfirmImport = content.match(/import\s+.*useConfirm.*from/);

  if (usesConfirm && !hasConfirmImport) {
    content = 'import { useConfirm } from "@/app/hooks/useConfirm";\n' + content;
    changed = true;
    console.log(`Added useConfirm import to ${file}`);
  }

  // Check confirmAction without useConfirm hook instantiation
  const usesConfirmAction = content.includes('confirmAction(');
  const hasConfirmHook = content.includes('const { confirmAction');
  
  if (usesConfirmAction && !hasConfirmHook) {
    console.log(`WARNING: ${file} uses confirmAction but doesn't instantiate useConfirm hook!`);
  }

  if (changed) {
    fs.writeFileSync(filePath, content);
    totalFixed++;
  }
});

console.log(`Analysis complete. Fixed ${totalFixed} files.`);
