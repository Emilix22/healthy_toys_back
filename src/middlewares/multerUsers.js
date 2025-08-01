const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      
      return cb(null, 'public/img/users')
        
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix + path.extname(file.originalname))
    }
  })
  
  const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024,} // 5MB
  })

  module.exports = upload;