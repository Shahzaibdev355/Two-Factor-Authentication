
import mongoose, { Document, Schema } from "mongoose";
import { User } from "./user.model";

export interface IFolderSchema extends Document {
    name: string;
    userId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const folderSchema = new Schema<IFolderSchema>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: User.modelName,
            required: true,
        },
    },
    { timestamps: true }
);

// Unique folder name per user
folderSchema.index({ name: 1, userId: 1 }, { unique: true });

export const Folder = mongoose.model<IFolderSchema>("plant_user_folder", folderSchema);