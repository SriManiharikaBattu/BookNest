const fs = require('fs');
const path = require('path');

function replaceFileImages(filename) {
  const filepath = path.join(__dirname, '..', 'utils', filename);
  let content = fs.readFileSync(filepath, 'utf8');
  
  // Replace openlibrary and placehold.co links with dummyimage.com which is lighter and less likely to be blocked
  // Using regex to replace the coverImage field dynamically
  content = content.replace(/coverImage:\s*"(.*?)"/g, (match, url) => {
    // Extract title from the object context or just use a generic random seed
    // Since it's a regex replace on the file, we might not have the title easily.
    // Let's just generate a reliable dummyimage link with the isbn or random number
    const isbnMatch = url.match(/isbn\/(\d+)-L/);
    const isbn = isbnMatch ? isbnMatch[1] : Math.floor(Math.random() * 1000000);
    return `coverImage: "https://dummyimage.com/400x600/3a2321/f5ca32.jpg&text=Book+${isbn}"`;
  });

  fs.writeFileSync(filepath, content);
  console.log(`Updated ${filename}`);
}

replaceFileImages('booksData.js');
replaceFileImages('moreBooksData.js');
