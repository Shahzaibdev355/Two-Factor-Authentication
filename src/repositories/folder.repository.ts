import { Folder, IFolderSchema } from "../models/folder.model";
import { IFolderRepository } from "../interfaces/folder.interface";
import { QueryFilter } from "mongoose";

export default class FolderRepository implements IFolderRepository {
  async create(payload: Partial<IFolderSchema>): Promise<IFolderSchema> {
    return Folder.create(payload);
    
  }

  async find(
    filter: QueryFilter<IFolderSchema>
  ): Promise<IFolderSchema[]> {
    return Folder.find(filter);
  }

  async findOneAndDelete(
    filter: QueryFilter<IFolderSchema>
  ): Promise<IFolderSchema | null> {
    return Folder.findOneAndDelete(filter);
  }
}
