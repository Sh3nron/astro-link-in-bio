import sharp from 'sharp';
import fs from 'fs';

const width = 256;
const height = 256;
const buffer = Buffer.alloc(width * height * 4);

for (let i = 0; i < width * height; i++) {
  const value = Math.floor(Math.random() * 256);
  // Grayscale noise
  const offset = i * 4;
  buffer[offset] = value;     // R
  buffer[offset + 1] = value; // G
  buffer[offset + 2] = value; // B
  buffer[offset + 3] = 255;   // A
}

// Ensure public directory exists
if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}

sharp(buffer, { raw: { width, height, channels: 4 } })
  .png({ compressionLevel: 9 })
  .toFile('public/noise.png')
  .then(info => {
    console.log('Noise image generated:', info);
  })
  .catch(err => {
    console.error('Error generating noise image:', err);
    process.exit(1);
  });
