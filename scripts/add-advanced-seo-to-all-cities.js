const fs = require('fs');
const path = require('path');

const cities = [
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

function addAdvancedSEOComponents(content, cityName, cityFolder) {
  let updatedContent = content;
  
  // Add imports if not already present
  const importsToAdd = [
    'import Breadcrumb from "@/components/breadcrumb"',
    'import ReviewSchema from "@/components/review-schema"',
    'import SEOContentBlock from "@/components/seo-content-block"'
  ];
  
  importsToAdd.forEach(importLine => {
    if (!updatedContent.includes(importLine)) {
      const schemaImport = 'import SchemaMarkup from "@/components/schema-markup"';
      updatedContent = updatedContent.replace(schemaImport, schemaImport + '\n' + importLine);
    }
  });
  
  // Add ReviewSchema if not present
  if (!updatedContent.includes('<ReviewSchema')) {
    const schemaLine = `      <SchemaMarkup type="city" city="${cityName}"`;
    const reviewSchemaLine = `      <ReviewSchema businessName="AI Portret Pro" city="${cityName}" />`;
    updatedContent = updatedContent.replace(schemaLine, reviewSchemaLine + '\n      ' + schemaLine);
  }
  
  // Add Breadcrumb if not present
  if (!updatedContent.includes('<Breadcrumb')) {
    const breadcrumbComponent = `      <Breadcrumb items={[
        { label: "LinkedIn Fotografie", href: "/linkedin-profielfoto" },
        { label: "${cityName}" }
      ]} />`;
    updatedContent = updatedContent.replace(
      '      <Header />',
      '      <Header />\n' + breadcrumbComponent
    );
  }
  
  // Add SEO Content Block before photo lightbox
  if (!updatedContent.includes('<SEOContentBlock')) {
    const seoContentBlock = `      {/* SEO Content Enhancement */}
      <SEOContentBlock city="${cityName}" showLocalKeywords={true} />

`;
    const lightboxComment = '      {/* Photo Lightbox */}';
    if (updatedContent.includes(lightboxComment)) {
      updatedContent = updatedContent.replace(lightboxComment, seoContentBlock + lightboxComment);
    }
  }
  
  return updatedContent;
}

let totalUpdates = 0;

cities.forEach(city => {
  const filePath = path.join(__dirname, '..', 'app', `linkedin-foto-laten-maken-${city.folder}`, 'page.tsx');
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    content = addAdvancedSEOComponents(content, city.name, city.folder);
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Added advanced SEO components to ${city.name}`);
      totalUpdates++;
    } else {
      console.log(`ℹ️  ${city.name} already has advanced SEO components`);
    }
  } else {
    console.log(`❌ File not found: ${filePath}`);
  }
});

console.log(`🎯 Advanced SEO update complete! Updated ${totalUpdates} cities`);
