import {IUserRepository} from '../interfaces/user.interface';
import {IUserSchema} from '../models/user.model';
import { User } from '../models/user.model';

import { TCreateUserInput } from '@/types/createUserInput.type'; 

import {QueryFilter, UpdateQuery} from 'mongoose';

export default class UserRepository implements IUserRepository {
    // Implementation of user repository methods would go here

    findOne = (filter: QueryFilter<IUserSchema>, select: string='') => {
        return User.findOne(filter).select(select);
    }


    // create = (payload: IUserSchema) => {

    //     return User.create(payload);
    // }

    create = (payload: TCreateUserInput) => {
        return User.create(payload);
    };
      

    updateOne = (filter: QueryFilter<IUserSchema>, update: UpdateQuery<IUserSchema>)=>{
        return User.updateOne(filter, update);
    }

}