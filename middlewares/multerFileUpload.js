const multer = require('multer');

const storage = multer.diskStorage({
    destination: 'public/uploads/postsThumbanails',
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

// const fileFilter = function (req, file, cb) {
//     // Accept only specific file types
//     if (
//         file.mimetype === 'image/jpeg' ||
//         file.mimetype === 'image/png' ||
//         file.mimetype === 'image/jpg'
//     ) {
//         cb(null, true); // Accept the file
//     } else {

//         // cb(new Error('Invalid file type. Only JPEG, JPG, and PNG files are allowed.'), false); // Reject the file
//     }
// };
module.exports = multer({
    storage: storage,
    limits: {
        fieldSize: 25 * 1024 * 1024, // 5MB in bytes
    }
    // fileFilter: fileFilter,
});

