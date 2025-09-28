const fs = require('fs');
const path = require('path');

const cities = [
  { name: 'Amsterdam', folder: 'amsterdam' },
  { name: 'Rotterdam', folder: 'rotterdam' },
  { name: 'Den Haag', folder: 'den-haag' },
  { name: 'Utrecht', folder: 'utrecht' },
  { name: 'Eindhoven', folder: 'eindhoven' },
  { name: 'Groningen', folder: 'groningen' },
  { name: 'Tilburg', folder: 'tilburg' },
  { name: 'Almere', folder: 'almere' },
  { name: 'Breda', folder: 'breda' },
  { name: 'Nijmegen', folder: 'nijmegen' }
];

function addFooterBreadcrumbsToFile(filePath, cityName) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changes = 0;
  
  // Add breadcrumb import if not present
  if (!content.includes('import Breadcrumb from "@/components/breadcrumb"')) {
    const reviewSchemaImport = 'import ReviewSchema from "@/components/review-schema"';
    if (content.includes(reviewSchemaImport)) {
      content = content.replace(reviewSchemaImport, reviewSchemaImport + '\nimport Breadcrumb from "@/components/breadcrumb"');
      changes++;
    }
  }
  
  // Add breadcrumb component before the final closing div and style tag
  const breadcrumbComponent = `
      {/* Footer Breadcrumb Navigation */}
      <Breadcrumb items={[
        { label: "LinkedIn Fotografie", href: "/linkedin-profielfoto" },
        { label: "${cityName}" }
      ]} />`;
  
  // Find the pattern before closing style tag and div
  const styleTagPattern = /<style jsx>{`[\s\S]*?`}<\/style>\s*<\/div>\s*\)\s*}$/;
  
  if (content.match(styleTagPattern) && !content.includes('Footer Breadcrumb Navigation')) {
    content = content.replace(styleTagPattern, (match) => {
      return breadcrumbComponent + '\n\n' + match;
    });
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
  const filePath = path.join(__dirname, '..', 'app', `linkedin-foto-laten-maken-${city.folder}`, 'page.tsx');
  
  if (fs.existsSync(filePath)) {
    const wasUpdated = addFooterBreadcrumbsToFile(filePath, city.name);
    if (wasUpdated) {
      console.log(`✅ Added footer breadcrumbs to ${city.name}`);
      totalUpdates++;
    } else {
      console.log(`ℹ️  Footer breadcrumbs already exist or couldn't be added to ${city.name}`);
    }
  } else {
    console.log(`❌ File not found: ${filePath}`);
  }
});

console.log(`🎯 Footer breadcrumb addition complete! Updated ${totalUpdates} cities`);
