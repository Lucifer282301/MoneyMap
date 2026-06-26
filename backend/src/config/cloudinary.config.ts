import { v2 as cloudinary } from "cloudinary";
import { ENV } from "./env.config";
import multer from "multer";

cloudinary.config({
  cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
  api_key: ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET,
});

export { cloudinary };

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (_req, file, cb) => {
    const isValid = /^image\/(jpe?g|png)$/.test(file.mimetype);

    if (!isValid) {
      return cb(new Error("Only jpg, jpeg and png files are allowed"));
    }

    cb(null, true);
  },
});
