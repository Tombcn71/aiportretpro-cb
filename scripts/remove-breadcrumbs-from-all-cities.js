const fs = require('fs');
const path = require('path');

const cities = [
  'amsterdam', 'rotterdam', 'den-haag', 'utrecht', 'eindhoven',
  'groningen', 'tilburg', 'almere', 'breda', 'nijmegen'
];

function removeBreadcrumbsFromFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changes = 0;
  
  // Remove breadcrumb import
  const breadcrumbImportRegex = /import Breadcrumb from "@\/components\/breadcrumb"\s*\n?/g;
  if (content.match(breadcrumbImportRegex)) {
    content = content.replace(breadcrumbImportRegex, '');
    changes++;
  }
  
  // Remove breadcrumb usage (multiline pattern)
  const breadcrumbUsageRegex = /<Breadcrumb items=\{[^}]*\[[\s\S]*?\]\s*\} \/>\s*\n?/g;
  if (content.match(breadcrumbUsageRegex)) {
    content = content.replace(breadcrumbUsageRegex, '');
    changes++;
  }
  
  // Also try single line pattern
  const breadcrumbSingleLineRegex = /<Breadcrumb[^>]*\/>\s*\n?/g;
  if (content.match(breadcrumbSingleLineRegex)) {
    content = content.replace(breadcrumbSingleLineRegex, '');
    changes++;
  }
  
  if (changes > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  
  return false;
}

let totalUpdates = 0;

cities.forEach(city => {
  const filePath = path.join(__dirname, '..', 'app', `linkedin-foto-laten-maken-${city}`, 'page.tsx');
  
  if (fs.existsSync(filePath)) {
    const wasUpdated = removeBreadcrumbsFromFile(filePath);
    if (wasUpdated) {
      console.log(`✅ Removed breadcrumbs from ${city}`);
      totalUpdates++;
    } else {
      console.log(`ℹ️  No breadcrumbs found in ${city}`);
    }
  } else {
    console.log(`❌ File not found: ${filePath}`);
  }
});

console.log(`🎯 Breadcrumb removal complete! Updated ${totalUpdates} cities`);
