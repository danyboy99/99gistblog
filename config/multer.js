const multer = require("multer");
const path = require("path");

// Set storage engine
const storage = multer.diskStorage({
  destination: "./images/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

function checkFileType(file, cb) {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png|gif/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 4000000 }, // 4MB limit per file
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Middleware for handling multiple uploads
const uploadMultiple = upload.array("images", 10); // 'images' is the field name, 10 is max number of files

module.exports = uploadMultiple;
