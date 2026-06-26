import { UploadApiResponse } from "cloudinary";
import { cloudinary } from "../config/cloudinary.config";

export const uploadToCloudinary = (
  buffer: Buffer,
  folder: string,
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        quality: "auto:good",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result!);
      },
    );

    stream.end(buffer);
  });
};
