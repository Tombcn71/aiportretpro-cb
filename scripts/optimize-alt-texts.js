const fs = require('fs');
const path = require('path');

// Define optimized alt texts for different image types
const altTextTemplates = {
  'professional-man': (index, city) => city 
    ? `Professionele LinkedIn foto man ${index} - ${city} fotoshoot voorbeeld`
    : `Professionele LinkedIn foto man ${index} - AI headshot voorbeeld`,
  'professional-woman': (index, city) => city
    ? `Professionele LinkedIn foto vrouw ${index} - ${city} fotoshoot voorbeeld` 
    : `Professionele LinkedIn foto vrouw ${index} - AI headshot voorbeeld`,
  'casual-man': (index) => `Casual selfie man ${index} - voor AI fotoshoot training`,
  'casual-woman': (index) => `Casual selfie vrouw ${index} - voor AI fotoshoot training`,
  'before-after': 'Voor en na vergelijking AI fotoshoot - casual naar professioneel',
  'logo': 'AI Portret Pro logo - LinkedIn foto laten maken',
  'transformation': 'AI fotoshoot transformatie - van casual naar professioneel'
}

function generateAltText(imagePath, city = null) {
  const fileName = path.basename(imagePath, path.extname(imagePath))
  
  // Extract image type and index
  if (fileName.includes('professional-man')) {
    const index = fileName.match(/\d+/)?.[0] || '1'
    return altTextTemplates['professional-man'](index, city)
  }
  
  if (fileName.includes('professional-woman')) {
    const index = fileName.match(/\d+/)?.[0] || '1'
    return altTextTemplates['professional-woman'](index, city)
  }
  
  if (fileName.includes('casual-man')) {
    const index = fileName.match(/\d+/)?.[0] || '1'
    return altTextTemplates['casual-man'](index)
  }
  
  if (fileName.includes('casual-woman')) {
    const index = fileName.match(/\d+/)?.[0] || '1'
    return altTextTemplates['casual-woman'](index)
  }
  
  if (fileName.includes('before') || fileName.includes('after')) {
    return altTextTemplates['before-after']
  }
  
  if (fileName.includes('logo')) {
    return altTextTemplates['logo']
  }
  
  if (fileName.includes('transformation')) {
    return altTextTemplates['transformation']
  }
  
  // Default fallback
  return `Professionele LinkedIn fotografie voorbeeld - AI Portret Pro`
}

function optimizeAltTextsInFile(filePath, city = null) {
  let content = fs.readFileSync(filePath, 'utf8')
  let changes = 0
  
  // Find all Image components with alt attributes
  const imageRegex = /<Image[^>]*alt=["']([^"']*)["'][^>]*>/g
  const imageMatches = [...content.matchAll(imageRegex)]
  
  imageMatches.forEach(match => {
    const fullMatch = match[0]
    const currentAlt = match[1]
    
    // Extract src if available
    const srcMatch = fullMatch.match(/src=["']([^"']*)["']/)
    if (srcMatch) {
      const imagePath = srcMatch[1]
      const optimizedAlt = generateAltText(imagePath, city)
      
      // Only update if different and not already optimized
      if (currentAlt !== optimizedAlt && !currentAlt.includes('LinkedIn foto')) {
        const newImageTag = fullMatch.replace(
          `alt="${currentAlt}"`,
          `alt="${optimizedAlt}"`
        )
        content = content.replace(fullMatch, newImageTag)
        changes++
      }
    }
  })
  
  if (changes > 0) {
    fs.writeFileSync(filePath, content, 'utf8')
    console.log(`✅ Optimized ${changes} alt texts in ${path.basename(filePath)}`)
  }
  
  return changes
}

// Process all relevant files
const cities = [
  'amsterdam', 'rotterdam', 'den-haag', 'utrecht', 'eindhoven',
  'groningen', 'tilburg', 'almere', 'breda', 'nijmegen'
]

let totalChanges = 0

// Homepage
totalChanges += optimizeAltTextsInFile(path.join(__dirname, '..', 'app', 'page.tsx'))

// City pages
cities.forEach(city => {
  const cityName = city.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
  const filePath = path.join(__dirname, '..', 'app', `linkedin-foto-laten-maken-${city}`, 'page.tsx')
  
  if (fs.existsSync(filePath)) {
    totalChanges += optimizeAltTextsInFile(filePath, cityName)
  }
})

// Other important pages
const otherPages = ['pricing', 'contact', 'linkedin-profielfoto']
otherPages.forEach(page => {
  const filePath = path.join(__dirname, '..', 'app', page, 'page.tsx')
  if (fs.existsSync(filePath)) {
    totalChanges += optimizeAltTextsInFile(filePath)
  }
})

console.log(`🎯 Alt text optimization complete! Total changes: ${totalChanges}`);
