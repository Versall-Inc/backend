"use strict";

var multer = require('multer');

var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function filename(req, file, cb) {
    var uniqueName = "".concat(Date.now(), "-").concat(file.originalname);
    cb(null, uniqueName);
  }
});
var upload = multer({
  storage: storage,
  fileFilter: function fileFilter(req, file, cb) {
    var allowedTypes = /jpeg|jpg|png/;
    var isValid = allowedTypes.test(file.mimetype);
    if (isValid) cb(null, true);else cb(new Error('Only images are allowed!'));
  }
});
module.exports = upload;