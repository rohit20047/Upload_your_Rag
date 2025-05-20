import fs from 'fs';
import path from 'path';

export const cleanupOldFiles = (dir, currentFile, extension) => {
  fs.readdir(dir, (err, files) => {
    if (err) return console.error('Error reading upload directory:', err);

    files.forEach(file => {
      if (file !== currentFile && file.endsWith(extension)) {
        fs.unlink(path.join(dir, file), err => {
          if (err) console.error(`Error deleting file ${file}:`, err);
        });
      }
    });
  });
};
