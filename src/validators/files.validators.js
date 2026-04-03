import { body } from 'express-validator';

const newFileValidator = [
  body('file').custom((value, { req }) => {
    // Check for file existence
    if (!req.file) {
      throw new Error('File is required');
    }

    return true;
  }),
];

export default newFileValidator;
