import mongoose, { Schema } from "mongoose";
import { IImage } from "../interfaces/image.interface";

const imageSchema = new Schema<IImage>(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    folderId: { type: Schema.Types.ObjectId, required: true },
    imageUrl: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { timestamps: true }
);

export const Image = mongoose.model<IImage>("Image", imageSchema);
