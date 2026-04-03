import { body } from 'express-validator';

const newFolderValidator = [
  body('folder')
    .trim()
    .notEmpty()
    .withMessage('Folder Name is required')
    .bail()
    .isLength({ min: 2, max: 50 })
    .withMessage('Folder Name must be between 2 and 50 characters'),
];

export default newFolderValidator;
