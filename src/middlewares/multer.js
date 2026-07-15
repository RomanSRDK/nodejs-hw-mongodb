import multer from 'multer';
// import createHttpError from 'http-errors';
import { TEMP_UPLOAD_DIR } from '../constants/constants.js';

const storage = multer.diskStorage({
  destination: TEMP_UPLOAD_DIR,
  filename: function (req, file, cb) {
    const uniquePreffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

    const fileName = `${uniquePreffix}_${file.originalname}`;

    cb(null, fileName);
  },
});

export const upload = multer({ storage });

// export const upload = multer({
//   storage,
//   limits: {
//     fileSize: 5 * 1024 * 1024,
//   },
//   fileFilter(req, file, cb) {
//     if (!file.mimetype.startsWith('image/')) {
//       return cb(createHttpError(400, 'Only image files are allowed'));
//     }

//     cb(null, true);
//   },
// });

// "Когда придет файл, сохрани его на диск." multer.diskStorage
// Но multer нужно знать две вещи:
// 1. Куда сохранить?
// 2. Под каким именем?
// Поэтому передается объект с двумя настройками
