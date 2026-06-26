import UserModel from "../models/user.model";
import { NotFoundException } from "../utils/app-error";
import { UpdateUserSchemaType } from "../shared/validators/user.validator";
import { uploadToCloudinary } from "../utils/cloudinary-upload";

export const findByIdUserService = async (userId: string) => {
  const user = await UserModel.findById(userId);
  return user?.omitPassword();
};

export const updateUserService = async (
  userId: string,
  body: UpdateUserSchemaType,
  profilePic?: Express.Multer.File,
) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new NotFoundException("User not found");
  }

  if (profilePic) {
    const uploadedImage = await uploadToCloudinary(
      profilePic.buffer,
      "profiles",
    );

    user.profilePicture = uploadedImage.secure_url;
    user.profilePicturePublicId = uploadedImage.public_id;
  }

  user.set({
    name: body.name,
  });

  await user.save();

  return user.omitPassword();
};
