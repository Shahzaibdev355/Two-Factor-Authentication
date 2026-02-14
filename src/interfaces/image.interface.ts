import { Types } from "mongoose";

export interface IImage {
    userId: Types.ObjectId;
    folderId: Types.ObjectId;
    imageUrl: string;
    publicId: string;
    createdAt?: Date;
    updatedAt?: Date;
}


export interface IImageService {
    uploadImage(
        userId: Types.ObjectId,
        folderId: string,
        file: any
    ): Promise<IImage>;

    deleteImage(
        imageId: string,
        userId: Types.ObjectId
    ): Promise<boolean>;
}


export interface IImageRepository {
    create(data: IImage): Promise<IImage>;

    findById(id: string): Promise<IImage | null>;

    delete(id: string): Promise<IImage | null>;

    findByFolder(
        folderId: Types.ObjectId,
        userId: Types.ObjectId
    ): Promise<IImage[]>;

    deleteMany(filter: any): Promise<any>;
}
