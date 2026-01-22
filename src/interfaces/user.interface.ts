
import { RequestHandler } from 'express';
import {IUserSchema} from '../models/user.model';

import {QueryFilter, UpdateQuery, UpdateWriteOpResult} from 'mongoose';
import { TServiceSuccess } from '@/types/service.type';

import { TCreateUserInput } from '@/types/createUserInput.type'; 

// import Joi from "joi";

import * as Joi from '@hapi/joi';
import 'joi-extract-type';

import { loginSchema, registerSchema } from '@/validators/auth.validators';

export interface IUserRequestData{
    register: {
        body: Joi.extractType <typeof registerSchema>;
    }
    login:{
        body: Joi.extractType <typeof loginSchema>;
    }
}

export interface IUserController{
    register: RequestHandler
    login: RequestHandler
}

export interface IUserService{
    register: (payload: IUserRequestData['register']['body']) => Promise<TServiceSuccess<{userId: string}>>

    login: (payload: IUserRequestData['login']['body']) => Promise<
    TServiceSuccess<{
        userId: string,
        accesstoken: string
    }>>
}


export interface IUserRepository {
    findOne : (filter: QueryFilter<IUserSchema>, select?: string) => Promise<IUserSchema | null>;
    // create(payload: IUserSchema): Promise<IUserSchema>;

    create(payload: TCreateUserInput): Promise<IUserSchema>;

    updateOne(filter: QueryFilter<IUserSchema>, update: UpdateQuery<IUserSchema>): Promise<UpdateWriteOpResult>;
}