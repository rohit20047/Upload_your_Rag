import multer from 'multer';
import fs from 'fs';
import path from 'path';

const uploadDir = 'src/uploads/';
let currentFilename = '';

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    currentFilename = uniqueName;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  file.mimetype === allowedType
    ? cb(null, true)
    : cb(new Error('Only DOCX files are allowed!'), false);
};

const upload = multer({ storage, fileFilter });

export { upload, currentFilename, uploadDir };
