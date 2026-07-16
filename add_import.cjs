const fs = require('fs');

function addImport(path) {
  let content = fs.readFileSync(path, 'utf8');
  if (!content.includes('import { useConfirm }')) {
    const hookImport = 'import { useConfirm } from "@/app/hooks/useConfirm";\n';
    content = content.replace(/(import .*;\n)+/, match => match + hookImport);
    fs.writeFileSync(path, content);
    console.log('Added import to ' + path);
  }
}

addImport('src/app/pages/VoyagesPage.tsx');
addImport('src/app/pages/TarifsPage.tsx');
addImport('src/app/pages/ParamsPage.tsx');
addImport('src/app/pages/ChaloupesPage.tsx');
