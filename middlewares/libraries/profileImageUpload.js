const multer = require('multer');
const path = require('path');
const CustomError = require('../../helpers/error/CustomError');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const rootDir = path.dirname(require.main.filename);
    cb(null, path.join(rootDir, '/public/uploads'));
  },
  filename: function (req, file, cb) {
    const extension = file.mimetype.split('/')[1];
    req.savedProfileImage = 'IMG_' + req.user.id + '.' + extension;
    cb(null, req.savedProfileImage);
  },
});

const fileFilter = (req, file, cb) => {
  let allowedMimeTypes = [
    'image/jpg',
    'image/jpeg',
    'image/gif',
    'image/png',
    'image/webp',
  ];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new CustomError('Invalid Image Type', 400), false);
  }
  return cb(null, true);
};

const profileImageUpload = multer({ storage, fileFilter });

module.exports = profileImageUpload;
