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

function generateMetadata(cityName, folder) {
  return `import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "LinkedIn Foto Laten Maken ${cityName} | Professionele Fotoshoot €29 | 40 Foto's",
  description: "LinkedIn foto laten maken ${cityName}? ✓ AI fotoshoot 6x goedkoper dan fotograaf ✓ 40 professionele LinkedIn foto's in 15 min ✓ Perfect voor ${cityName} professionals ✓ Gratis levering",
  keywords: "LinkedIn foto laten maken ${cityName}, profielfoto LinkedIn ${cityName}, fotograaf LinkedIn ${cityName}, zakelijk portret ${cityName}, LinkedIn fotoshoot ${cityName}, professionele foto ${cityName}, headshot fotograaf ${cityName}",
  openGraph: {
    title: "LinkedIn Foto Laten Maken ${cityName} | AI Fotoshoot €29",
    description: "6x goedkoper dan fotograaf ✓ 40 professionele LinkedIn foto's in 15 min ✓ Perfect voor ${cityName} professionals",
    url: "https://aiportretpro.com/linkedin-foto-laten-maken-${folder}",
    type: "website",
    locale: "nl_NL",
  },
  alternates: {
    canonical: "https://aiportretpro.com/linkedin-foto-laten-maken-${folder}",
  },
  robots: {
    index: true,
    follow: true,
  },
}

`;
}

function addSchemaImportAndComponent(content, cityName) {
  // Add SchemaMarkup import
  const importLine = 'import SchemaMarkup from "@/components/schema-markup"';
  if (!content.includes(importLine)) {
    const howItWorksImport = 'import HowItWorks from "@/components/how-it-works"';
    content = content.replace(howItWorksImport, howItWorksImport + '\n' + importLine);
  }
  
  // Add SchemaMarkup component
  const schemaComponent = `      <SchemaMarkup type="city" city="${cityName}" url="https://aiportretpro.com/linkedin-foto-laten-maken-${cityName.toLowerCase().replace(' ', '-')}" />`;
  if (!content.includes('<SchemaMarkup')) {
    content = content.replace(
      '      <Header />',
      schemaComponent + '\n      <Header />'
    );
  }
  
  return content;
}

cities.forEach(city => {
  const filePath = path.join(__dirname, '..', 'app', `linkedin-foto-laten-maken-${city.folder}`, 'page.tsx');
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if metadata already exists
    if (!content.includes('export const metadata')) {
      const metadata = generateMetadata(city.name, city.folder);
      
      // Find the first import and add metadata before "use client"
      const useClientIndex = content.indexOf('"use client"');
      if (useClientIndex !== -1) {
        content = metadata + '\n' + content;
      }
    }
    
    // Add schema markup
    content = addSchemaImportAndComponent(content, city.name);
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated metadata for ${city.name}`);
  } else {
    console.log(`❌ File not found: ${filePath}`);
  }
});

console.log('🎯 All city metadata updated!');
