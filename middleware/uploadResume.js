// middlewares/uploadResume.js
const multer = require('multer');
const uploadResume = multer({ storage: multer.memoryStorage() }); //// Memory में file जाएगी (RAM)

module.exports = uploadResume;


// यह code एक middleware बना रहा है जिसका नाम है uploadResume, और यह request में आने वाली file को RAM में temporarily store करता है।

// memoryStorage() मतलब PDF file RAM में buffer के रूप में मिलती है:
// → req.file.buffer
