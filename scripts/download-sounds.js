const https = require('https');
const fs = require('fs');
const path = require('path');

const soundsDir = path.join(__dirname, '../assets/sounds');

if (!fs.existsSync(soundsDir)) {
  fs.mkdirSync(soundsDir, { recursive: true });
}

const sounds = [
  {
    name: 'dice-roll.mp3',
    url: 'https://raw.githubusercontent.com/arnofaure/free-sfx/main/Input/Input%2001.mp3',
  },
  {
    name: 'move.mp3',
    url: 'https://raw.githubusercontent.com/arnofaure/free-sfx/main/Input/Input%2002.mp3',
  },
  {
    name: 'hit.mp3',
    url: 'https://raw.githubusercontent.com/arnofaure/free-sfx/main/Impact/Impact%2001.mp3',
  },
  {
    name: 'win.mp3',
    url: 'https://raw.githubusercontent.com/arnofaure/free-sfx/main/UI/UI%2001.mp3',
  },
  {
    name: 'error.mp3',
    url: 'https://raw.githubusercontent.com/arnofaure/free-sfx/main/UI/UI%2002.mp3',
  },
];

async function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        fs.unlinkSync(filepath);
        downloadFile(response.headers.location, filepath).then(resolve).catch(reject);
      } else {
        file.close();
        fs.unlinkSync(filepath);
        reject(new Error(`Failed to download: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      reject(err);
    });
  });
}

async function downloadSounds() {
  console.log('Downloading sound files...');
  
  for (const sound of sounds) {
    const filepath = path.join(soundsDir, sound.name);
    try {
      console.log(`Downloading ${sound.name}...`);
      await downloadFile(sound.url, filepath);
      console.log(`✓ Downloaded ${sound.name}`);
    } catch (error) {
      console.error(`✗ Failed to download ${sound.name}:`, error.message);
    }
  }
  
  console.log('Done!');
}

downloadSounds();
