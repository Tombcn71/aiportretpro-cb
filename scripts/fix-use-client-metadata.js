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

function generateLayoutFile(cityName, folder) {
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

export default function ${cityName.replace(/\s+/g, '')}Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}`;
}

function removeMetadataFromPageFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove metadata import and export
  content = content.replace(/import type { Metadata } from "next"\s*\n/, '');
  content = content.replace(/export const metadata: Metadata = \{[\s\S]*?\}\s*\n/, '');
  
  // Ensure "use client" is at the top
  if (!content.startsWith('"use client"')) {
    // Remove existing "use client" if it's somewhere else
    content = content.replace(/\n?"use client"\s*\n/, '');
    // Add it at the top
    content = '"use client"\n\n' + content;
  }
  
  return content;
}

let totalUpdates = 0;

cities.forEach(city => {
  const pageFilePath = path.join(__dirname, '..', 'app', `linkedin-foto-laten-maken-${city.folder}`, 'page.tsx');
  const layoutFilePath = path.join(__dirname, '..', 'app', `linkedin-foto-laten-maken-${city.folder}`, 'layout.tsx');
  
  if (fs.existsSync(pageFilePath)) {
    // Create layout file with metadata
    const layoutContent = generateLayoutFile(city.name, city.folder);
    fs.writeFileSync(layoutFilePath, layoutContent, 'utf8');
    
    // Remove metadata from page file and fix "use client"
    const cleanedPageContent = removeMetadataFromPageFile(pageFilePath);
    fs.writeFileSync(pageFilePath, cleanedPageContent, 'utf8');
    
    console.log(`✅ Fixed ${city.name} - created layout.tsx and cleaned page.tsx`);
    totalUpdates++;
  } else {
    console.log(`❌ Page file not found: ${pageFilePath}`);
  }
});

console.log(`🎯 Fixed "use client" metadata issue for ${totalUpdates} cities`);
