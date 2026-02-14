import { RequestHandler } from "express";
import {
    IFolderController,
    IFolderService,
} from "../interfaces/folder.interface";
import { IAuthenticateRequest } from "../types/auth.types";
import { Types } from "mongoose";

export default class FolderController implements IFolderController {
    constructor(private folderService: IFolderService) { }

    create: RequestHandler = async (req, res, next) => {
        try {
            const { user } = req as IAuthenticateRequest;
            const body = req.body;


            const response = await this.folderService.create(
                user._id,
                body
            );


            res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    };

    getAll: RequestHandler = async (req, res, next) => {
        try {
            const { user } = req as IAuthenticateRequest;

            const response = await this.folderService.getAll(user._id);

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    delete: RequestHandler = async (req, res, next) => {
        try {
            const { user } = req as IAuthenticateRequest;
            const { id } = req.params;

            if (!id || Array.isArray(id)) {
                throw new Error("Invalid folder id");
            }

            const folderId = new Types.ObjectId(id);

            const response = await this.folderService.delete(
                user._id,
                folderId
            );

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

}
