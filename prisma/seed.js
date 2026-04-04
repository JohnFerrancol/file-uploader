import { supabase } from '../src/config/supabase.js';
import { insertUser } from '../src/services/auth.services.js';
import { insertNewFile } from '../src/services/files.services.js';
import { insertFolder } from '../src/services/folders.services.js';
import { prisma } from '../src/config/prisma.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'node:url';

// Get current working directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Navigate to the dummyFiles directory
const DUMMY_DIR = path.resolve(__dirname, '../dummyFiles');

const main = async () => {
  console.log('Seeding Database started...');

  // Reset DB
  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE "File" RESTART IDENTITY CASCADE;'
  );
  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE "Folder" RESTART IDENTITY CASCADE;'
  );
  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE "User" RESTART IDENTITY CASCADE;'
  );
  console.log('DB reset.');

  // Create User
  await insertUser('JohnFerrancol', 'password123!');

  // Create Folder for the User
  await insertFolder('Docs', 1);

  console.log('Inserted user and folder');

  const files = [
    { name: 'store.png', folderID: null, mimetype: 'image/pmg' },
    { name: 'Traffic.pdf', folderID: null, mimetype: 'application/pdf' },
    { name: 'example.txt', folderID: 1, mimetype: 'text/plain' },
  ];

  for (const file of files) {
    // Get the buffer information of the file
    const filePath = path.join(DUMMY_DIR, file.name);
    const buffer = fs.readFileSync(filePath);

    const fileKey = `file/${Date.now()}-${file.name}`;
    const fileName = `${Date.now()}-${file.name}`;

    // Add the file to supabase
    const { error } = await supabase.storage
      .from('files')
      .upload(fileKey, buffer, { contentType: file.mimetype });

    if (error) {
      console.error(`Upload error: ${error}`);
      continue;
    }

    // Insert to the created user
    await insertNewFile(
      fileName,
      buffer.length,
      fileKey,
      file.mimetype,
      1,
      file.folderID
    );

    console.log(`Inserted File, ${file.name}`);
  }

  console.log('Seeding Completed!');
};

// Execute function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
