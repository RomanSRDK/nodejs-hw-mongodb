import multer from 'multer';
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

// "Когда придет файл, сохрани его на диск." multer.diskStorage
// Но multer нужно знать две вещи:
// 1. Куда сохранить?
// 2. Под каким именем?
// Поэтому передается объект с двумя настройками
