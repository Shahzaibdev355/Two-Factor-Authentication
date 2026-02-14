import { RequestHandler } from "express";
import mongoose, { QueryFilter } from "mongoose";
import { IFolderSchema } from "../models/folder.model";
import { TServiceSuccess } from "../types/service.type";
import { Types } from "mongoose";

export interface IFolderRequestData {
  create: {
    body: {
      name: string;
    };
  };
  delete: {
    params: {
      id: string;
    };
  };
}

export interface IFolderController {
  create: RequestHandler;
  getAll: RequestHandler;
  delete: RequestHandler;
}

export interface IFolderService {

    
  create: (
    // userId: string,
    userId: mongoose.Types.ObjectId,
    payload: IFolderRequestData["create"]["body"]
  ) => Promise<TServiceSuccess<IFolderSchema>>;

  getAll: (userId: mongoose.Types.ObjectId) => Promise<TServiceSuccess<IFolderSchema[]>>;

  delete: (
    userId: mongoose.Types.ObjectId,
    folderId: Types.ObjectId
  ) => Promise<TServiceSuccess<null>>;
}

export interface IFolderRepository {
  create: (payload: Partial<IFolderSchema>) => Promise<IFolderSchema>;

  find: (filter: QueryFilter<IFolderSchema>) => Promise<IFolderSchema[]>;

  findOneAndDelete: (
    filter: QueryFilter<IFolderSchema>
  ) => Promise<IFolderSchema | null>;
}
