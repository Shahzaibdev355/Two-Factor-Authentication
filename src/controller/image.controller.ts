import { RequestHandler } from "express";
import { IAuthenticateRequest } from "../types/auth.types";
import { IImageService } from "../interfaces/image.interface";

export default class ImageController {
  constructor(private imageService: IImageService) {}

  upload: RequestHandler = async (req, res, next) => {
    try {
      const { user } = req as IAuthenticateRequest;
      const folderIdParam = req.params.folderId;

      if (!folderIdParam || Array.isArray(folderIdParam)) {
        throw new Error("Invalid folderId");
      }

      if (!req.file) {
        throw new Error("No file uploaded");
      }

      const image = await this.imageService.uploadImage(
        user._id,
        folderIdParam,
        req.file
      );

      res.status(201).json({
        success: true,
        data: image,
      });
    } catch (error) {
      next(error);
    }
  };

  delete: RequestHandler = async (req, res, next) => {
    try {
      const { user } = req as IAuthenticateRequest;
      const imageIdParam = req.params.imageId;

      if (!imageIdParam || Array.isArray(imageIdParam)) {
        throw new Error("Invalid imageId");
      }

      await this.imageService.deleteImage(imageIdParam, user._id);

      res.status(200).json({
        success: true,
        message: "Image deleted successfully",
      });
    } catch (error) {
      next(error);
    
    }
  };
}
