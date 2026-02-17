import { Image } from "../models/image.model";
import { IImage } from "../interfaces/image.interface";
import { Types } from "mongoose";
import { IImageRepository } from "../interfaces/image.interface";

export default class ImageRepository implements IImageRepository {
    async create(data: IImage) {
        return Image.create(data);
    }

    async findById(id: string) {
        return Image.findById(id);
    }


    async delete(id: string) {
        return Image.findByIdAndDelete(id);
    }

    async findByFolder(folderId: Types.ObjectId, userId: Types.ObjectId) {
        return Image.find({ folderId, userId });
    }

    async getAllImages(userId: Types.ObjectId) {
        return Image.find({ userId }).sort({ createdAt: -1 });
    }


    async deleteMany(filter: any) {
        return Image.deleteMany(filter);
    }
}

// export default new ImageRepository();
