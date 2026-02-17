


import { IImage, IImageRepository, IImageService } from "../interfaces/image.interface";

import cloudinary from "../config/cloudinary";
import { Types } from "mongoose";
import { TServiceSuccess } from "@/types/service.type";

class ImageService implements IImageService {
    constructor(private imageRepository: IImageRepository) { }

    async uploadImage(
        userId: Types.ObjectId,
        folderId: string,
        file: any
    ) {
        return this.imageRepository.create({
            userId,
            folderId: new Types.ObjectId(folderId),
            imageUrl: file.path,
            publicId: file.filename,
        });
    }


    async getAllImages(
        userId: Types.ObjectId
    ): Promise<IImage[]> {

        return this.imageRepository.getAllImages(userId);
    }


    async deleteImage(imageId: string, userId: Types.ObjectId) {
        const image = await this.imageRepository.findById(imageId);

        if (!image) throw new Error("Image not found");

        if (image.userId.toString() !== userId.toString()) {
            throw new Error("Unauthorized");
        }

        await cloudinary.uploader.destroy(image.publicId);

        await this.imageRepository.delete(imageId);

        return true;
    }
}

export default ImageService
