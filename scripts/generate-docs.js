const fs = require('fs');
const path = require('path');

// Extract JSDoc comments from Vue files
function extractVueComments(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const comments = [];
  
  // Extract script content from Vue SFC
  const scriptMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/);
  if (!scriptMatch) return comments;
  
  const scriptContent = scriptMatch[1];
  
  // Extract JSDoc blocks
  const jsDocRegex = /\/\*\*[\s\S]*?\*\//g;
  const matches = scriptContent.match(jsDocRegex);
  
  // Extract function definitions
  const functionRegex = /(?:const|function)\s+(\w+)\s*[=\(]/g;
  const functionMatches = scriptContent.match(functionRegex);
  
  // Extract component name
  const componentNameMatch = content.match(/<script[^>]*>\s*(?:export\s+default)?\s*(?:const\s+\w+\s*=\s*)?([^{\s]*)/);
  const componentName = componentNameMatch ? componentNameMatch[1].trim() : path.basename(filePath, '.vue');
  
  if (matches || functionMatches) {
    comments.push({
      file: path.basename(filePath),
      componentName: componentName,
      functions: functionMatches || [],
      comments: matches || [],
      scriptContent: scriptContent
    });
  }
  
  return comments;
}

// Extract TypeScript comments and interfaces
function extractTSComments(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const comments = [];
  
  // Match JSDoc blocks
  const jsDocRegex = /\/\*\*[\s\S]*?\*\//g;
  const interfaceRegex = /interface\s+(\w+)[\s\S]*?}/g;
  const typeRegex = /type\s+(\w+)[\s\S]*?}/g;
  const functionRegex = /(?:const|function|export\s+function)\s+(\w+)\s*[=\(]/g;
  const classRegex = /export\s+(?:const|function|class)\s+(\w+)/g;
  
  const jsDocMatches = content.match(jsDocRegex);
  const interfaceMatches = content.match(interfaceRegex);
  const typeMatches = content.match(typeRegex);
  const functionMatches = content.match(functionRegex);
  const classMatches = content.match(classRegex);
  
  comments.push({
    file: path.basename(filePath),
    comments: jsDocMatches || [],
    interfaces: interfaceMatches || [],
    types: typeMatches || [],
    functions: functionMatches || [],
    classes: classMatches || [],
    content: content
  });
  
  return comments;
}

// Generate detailed documentation for Vue components
function generateComponentDoc(component) {
  let markdown = `### ${component.componentName}\n\n`;
  
  // Add component description from JSDoc
  if (component.comments.length > 0) {
    component.comments.forEach(comment => {
      markdown += `${comment.trim()}\n\n`;
    });
  }
  
  // Add functions documentation
  if (component.functions.length > 0) {
    markdown += `#### Functions\n\n`;
    component.functions.forEach(func => {
      markdown += `- \`${func[1]}\`\n`;
    });
    markdown += '\n';
  }
  
  // Add script content preview
  if (component.scriptContent) {
    markdown += `#### Script Content\n\n`;
    markdown += '```typescript\n';
    // Show first 20 lines of script
    const lines = component.scriptContent.split('\n').slice(0, 20);
    markdown += lines.join('\n');
    if (component.scriptContent.split('\n').length > 20) {
      markdown += '\n// ... more lines';
    }
    markdown += '\n```\n\n';
  }
  
  return markdown;
}

// Generate detailed documentation for TypeScript files
function generateTSDoc(fileData) {
  let markdown = `### ${fileData.file}\n\n`;
  
  // Add JSDoc comments
  if (fileData.comments.length > 0) {
    fileData.comments.forEach(comment => {
      markdown += `${comment.trim()}\n\n`;
    });
  }
  
  // Add interfaces
  if (fileData.interfaces.length > 0) {
    markdown += `#### Interfaces\n\n`;
    fileData.interfaces.forEach(iface => {
      markdown += '```typescript\n';
      markdown += iface.trim();
      markdown += '\n```\n\n';
    });
  }
  
  // Add types
  if (fileData.types.length > 0) {
    markdown += `#### Types\n\n`;
    fileData.types.forEach(type => {
      markdown += '```typescript\n';
      markdown += type.trim();
      markdown += '\n```\n\n';
    });
  }
  
  // Add functions
  if (fileData.functions.length > 0) {
    markdown += `#### Functions\n\n`;
    fileData.functions.forEach(func => {
      markdown += `- \`${func[1]}\`\n`;
    });
    markdown += '\n';
  }
  
  // Add classes
  if (fileData.classes.length > 0) {
    markdown += `#### Classes/Exports\n\n`;
    fileData.classes.forEach(cls => {
      markdown += `- \`${cls[1]}\`\n`;
    });
    markdown += '\n';
  }
  
  return markdown;
}

// Generate complete markdown documentation
function generateMarkdown(allData) {
  let markdown = `# API Documentation\n\n`;
  markdown += `> Generated automatically from source code\n`;
  markdown += `> Last updated: ${new Date().toISOString()}\n\n`;
  
  // Group by file type
  const components = allData.filter(d => d.file.endsWith('.vue'));
  const composables = allData.filter(d => d.file.includes('use') && d.file.endsWith('.ts'));
  const stores = allData.filter(d => d.file.includes('Store') && d.file.endsWith('.ts'));
  const types = allData.filter(d => d.file.endsWith('.ts') && !d.file.includes('use') && !d.file.includes('Store'));
  const views = allData.filter(d => d.file.endsWith('.vue') && (d.file.includes('View') || d.file === 'App.vue'));
  
  // Components section
  if (components.length > 0) {
    markdown += `## 🧩 Components\n\n`;
    components.forEach(comp => {
      markdown += generateComponentDoc(comp);
    });
  }
  
  // Composables section
  if (composables.length > 0) {
    markdown += `## 🎣 Composables\n\n`;
    composables.forEach(comp => {
      markdown += generateTSDoc(comp);
    });
  }
  
  // Stores section
  if (stores.length > 0) {
    markdown += `## 🗃️ Stores\n\n`;
    stores.forEach(store => {
      markdown += generateTSDoc(store);
    });
  }
  
  // Types section
  if (types.length > 0) {
    markdown += `## 📝 Types\n\n`;
    types.forEach(type => {
      markdown += generateTSDoc(type);
    });
  }
  
  // Views section
  if (views.length > 0) {
    markdown += `## 📱 Views\n\n`;
    views.forEach(view => {
      markdown += generateComponentDoc(view);
    });
  }
  
  // Add summary
  markdown += `## 📊 Summary\n\n`;
  markdown += `- **Components**: ${components.length}\n`;
  markdown += `- **Composables**: ${composables.length}\n`;
  markdown += `- **Stores**: ${stores.length}\n`;
  markdown += `- **Types**: ${types.length}\n`;
  markdown += `- **Views**: ${views.length}\n`;
  markdown += `- **Total Files**: ${allData.length}\n\n`;
  
  return markdown;
}

// Main function
function generateDocs() {
  const srcDir = path.join(__dirname, '../apps/web/src');
  const outputDir = path.join(__dirname, '../docs');
  
  // Create docs directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const allData = [];
  
  // Process all Vue and TS files
  function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        processDirectory(filePath);
      } else if (file.endsWith('.vue')) {
        allData.push(...extractVueComments(filePath));
      } else if (file.endsWith('.ts')) {
        allData.push(...extractTSComments(filePath));
      }
    });
  }
  
  processDirectory(srcDir);
  
  // Generate markdown
  const markdown = generateMarkdown(allData);
  
  // Write to file
  fs.writeFileSync(path.join(outputDir, 'README.md'), markdown);
  
  console.log('✅ Documentation generated successfully!');
  console.log(`📁 Documentation saved to: ${path.join(outputDir, 'README.md')}`);
  console.log(`📊 Processed ${allData.length} files`);
  console.log(`🧩 Components: ${allData.filter(d => d.file.endsWith('.vue') && !d.file.includes('View')).length}`);
  console.log(`📱 Views: ${allData.filter(d => d.file.endsWith('.vue') && (d.file.includes('View') || d.file === 'App.vue')).length}`);
  console.log(`🎣 Composables: ${allData.filter(d => d.file.includes('use') && d.file.endsWith('.ts')).length}`);
  console.log(`🗃️ Stores: ${allData.filter(d => d.file.includes('Store') && d.file.endsWith('.ts')).length}`);
  console.log(`📝 Types: ${allData.filter(d => d.file.endsWith('.ts') && !d.file.includes('use') && !d.file.includes('Store')).length}`);
}

// Run generator
generateDocs();
