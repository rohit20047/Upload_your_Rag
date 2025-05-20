import express from 'express';
import path from 'path';
import { upload, currentFilename, uploadDir } from '../middleware/multerConfig.js';
import { cleanupOldFiles } from '../utils/fileCleanup.js';
import { processDocxAndEmbed } from '../services/docxProcessor.js';

const router = express.Router();

router.post('/', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    cleanupOldFiles(uploadDir, currentFilename, '.docx');

    const uploadedFilePath = path.join(uploadDir, currentFilename);
    const result = await processDocxAndEmbed(uploadedFilePath);

    if (!result.success) {
      return res.status(500).json({ message: 'Embedding failed', error: result.message });
    }

    res.status(200).json({
      message: 'DOCX uploaded and embedded successfully',
      filename: currentFilename,
      path: `/uploads/${currentFilename}`,
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

export default router;
