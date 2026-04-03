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

const upload = multer({
  // Ensures a 20MB File Limit
  limits: { fileSize: 20 * 1024 * 1024 },
  // Ensures the correct file type
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'text/plain',
      'image/jpeg',
      'image/png',
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true); // Accept file
    } else {
      cb(new Error('INVALID_TYPE'), false); // Reject file
    }
  },
  storage: storage,
}).single('file');

// We define these validators so that we do not upload the files to the tmp folder
const handleMulterError = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      // Let the default error message be Upload Error
      let msg = 'Upload Error';

      // Change the error message to the file limit or correct file type if appropriate
      if (err.code === 'LIMIT_FILE_SIZE')
        msg = 'File too large (Maximum 20MB Allowed)';
      if (err.message === 'INVALID_TYPE')
        msg = 'Only PDF, TXT, and Images Files allowed';

      return res.status(400).render('index', {
        showUploadDialog: true,
        title: 'New File',
        errors: [{ msg, path: 'file' }],
      });
    }
    next();
  });
};

export { handleMulterError };
