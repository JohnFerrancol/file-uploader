import multer from 'multer';
import { getFolderById } from '../services/folders.services.js';
import { formatSize } from '../middleware/locals.middleware.js';

// Allowed MIME types
const allowedTypes = [
  'application/pdf',
  'text/plain',
  'image/jpeg',
  'image/png',
];

// Max file size = 20MB
const MAX_FILE_SIZE = 20 * 1024 * 1024;

// Use memory storage for Supabase upload
const storage = multer.memoryStorage();

const upload = multer({
  // Ensures a 20MB File Limit
  limits: { fileSize: MAX_FILE_SIZE },
  // Ensures the correct file type
  fileFilter: (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true); // Accept file
    } else {
      cb(new Error('INVALID_TYPE'), false); // Reject file
    }
  },
  storage: storage,
}).single('file');

// We define these validators so that we do not upload the files to the tmp folder
const handleMulterError = async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      // Let the default error message be Upload Error
      let msg = 'Upload Error';

      // Change the error message to the file limit or correct file type if appropriate
      if (err.code === 'LIMIT_FILE_SIZE')
        msg = 'File too large (Maximum 20MB Allowed)';
      if (err.message === 'INVALID_TYPE')
        msg = 'Only PDF, TXT, and Images Files allowed';

      const folderId = req.params.id ? Number(req.params.id) : null;
      if (folderId) {
        const folder = await getFolderById(folderId);
        const formattedFolderFiles = folder.files.map((file) => ({
          ...file,
          size: formatSize(file.size),
          createdAt: file.createdAt.toLocaleDateString('en-SG', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          }),
        }));
        return res.status(400).render('folders/folder', {
          title: 'Folder',
          errors: [{ msg, path: 'file' }],
          files: formattedFolderFiles,
          folder: folder,
          showUploadDialog: true,
        });
      }
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
