const multer = require('multer');

/* Upload File - upload image */
exports.uploadFile = ({ savePath, uploadName }) => {
    let storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, `./resources/static/assets/uploads/${savePath}`)
        },
        filename: (req, file, cb) => {
            let filename = file.originalname;
            cb(null, Date.now() + '-' + filename)
        },
        fileFilter: (req, file, callback) => {
            let ext = path.extname(file.originalname)
            if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
                return callback(null, false)
            }
            callback(null, true)
        }
    })

    let upload = multer({
        storage: storage,
        limits: { fileSize: '4MB' }
    })

    return upload.single(`${uploadName}`)
}