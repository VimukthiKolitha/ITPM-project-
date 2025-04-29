import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads folder exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, uploadDir); // Save to uploads/ folder
  },
  filename: function (req, file, callback) {
    // Save the file with a unique timestamp + original extension
    const ext = path.extname(file.originalname);
    const filename = Date.now() + ext;
    callback(null, filename);
  }
});

const upload = multer({ storage });

export default upload;
