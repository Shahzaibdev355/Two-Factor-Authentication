import {
    IFolderService,
    IFolderRepository,
} from "../interfaces/folder.interface";
import { TServiceSuccess } from "../types/service.type";
import { IFolderSchema } from "../models/folder.model";
import { AppError } from "../utils/appError";
import { Types } from "mongoose";
import cloudinary from "../config/cloudinary";


import { IImageRepository } from "../interfaces/image.interface";

export default class FolderService implements IFolderService {
    constructor(
        private folderRepository: IFolderRepository,
        private imageRepository: IImageRepository
    ) { }

    async create(
        userId: Types.ObjectId,
        payload: { name: string }
    ): Promise<TServiceSuccess<IFolderSchema>> {
        try {
            const folder = await this.folderRepository.create({
                name: payload.name,
                userId: userId,
            });

            return {
                success: true,
                message: "Folders created successfully",
                data: folder,
            };
        } catch (error: any) {
            if (error.code === 11000) {
                throw new AppError("Folder name already exists", 400);
            }
            throw error;
        }
    }

    async getAll(
        userId: Types.ObjectId
    ): Promise<TServiceSuccess<IFolderSchema[]>> {
        const folders = await this.folderRepository.find({ userId });

        return {
            success: true,
            message: "Folders fetched successfully",
            data: folders,
        };
    }

    // async delete(
    //     userId: Types.ObjectId,
    //     folderId: Types.ObjectId
    // ): Promise<TServiceSuccess<null>> {
    //     await this.folderRepository.findOneAndDelete({
    //         _id: folderId,
    //         userId,
    //     });

    //     return {
    //         success: true,
    //         message: "Folder deleted successfully",
    //         data: null,
    //     };
    // }


    async delete(
        userId: Types.ObjectId,
        folderId: Types.ObjectId
    ): Promise<TServiceSuccess<null>> {

        // 1️⃣ Get all images inside folder
        const images = await this.imageRepository.findByFolder(folderId, userId);

        // 2️⃣ Delete all images from Cloudinary in parallel 🚀
        await Promise.all(
            images.map((img) =>
                cloudinary.uploader.destroy(img.publicId)
            )
        );

        // 3️⃣ Delete images from MongoDB
        await this.imageRepository.deleteMany({ folderId, userId });

        // 4️⃣ Delete the folder
        const deletedFolder = await this.folderRepository.findOneAndDelete({
            _id: folderId,
            userId,
        });

        if (!deletedFolder) {
            throw new AppError("Folder not found", 404);
        }

        return {
            success: true,
            message: "Folder and all images deleted successfully",
            data: null,
        };
    }
}
