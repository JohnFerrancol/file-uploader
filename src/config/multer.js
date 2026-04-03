import multer from 'multer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Get current working directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Navigate to the uploads folder in the project root
const UPLOADS_DIR = path.resolve(__dirname, '../../uploads');

// Temp Solution - Store the files locally in an uploads folder first
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

export const upload = multer({
  storage: storage,
});
