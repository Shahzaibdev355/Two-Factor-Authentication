
import { RequestHandler } from 'express';
import {IUserSchema} from '../models/user.model';

import {QueryFilter, UpdateQuery, UpdateWriteOpResult} from 'mongoose';
import { TServiceSuccess } from '@/types/service.type';

import { TCreateUserInput } from '@/types/createUserInput.type'; 

// import Joi from "joi";

import * as Joi from '@hapi/joi';
import 'joi-extract-type';

import { loginSchema, registerSchema, verfiy2FaValidator } from '@/validators/auth.validators';

export interface IUserRequestData{
    register: {
        body: Joi.extractType <typeof registerSchema>;
    }
    login:{
        body: Joi.extractType <typeof loginSchema>;
    }
    activate2FA: {
        user: IUserSchema
    }

    verify2FA: {
        user: IUserSchema;
        body: Joi.extractType <typeof verfiy2FaValidator>;
    }

    userInfo:{
        user: IUserSchema;
    }
    logOut:{
        user: IUserSchema;
    }
}

export interface IUserController{
    register: RequestHandler
    login: RequestHandler
    activate2FA: RequestHandler
    verify2Fa: RequestHandler
    userInfo : RequestHandler
    logOut: RequestHandler
}

export interface IUserService{
    register: (payload: IUserRequestData['register']['body']) => Promise<TServiceSuccess<{userId: string}>>

    login: (payload: IUserRequestData['login']['body']) => Promise<
    TServiceSuccess<{
        userId: string,
        accesstoken: string,
        twoFactorAuthActivated: boolean
    }>>


    activate2FA : (user: IUserRequestData['activate2FA']['user']) => Promise<
    TServiceSuccess<{
        qrDataUrl: string,
        recoveryCodes: string[]
    }>>

    
    verify2Fa : (user: IUserRequestData['verify2FA']['user'], payload:IUserRequestData['verify2FA']['body']) => Promise<
    TServiceSuccess<{
        userId: string,
        accessToken: string
    }>>

    userInfo: (user: IUserRequestData['userInfo']['user']) => Promise<
    TServiceSuccess<{

        userId: string
        firstName: string
        lastName: string
        email: string
        phoneNo: number
        twoFactorAuth: {
            activated: boolean; 
        }
        createdAt?: Date
    }>>

    logOut: (user: IUserRequestData['logOut']['user']) => Promise<
    TServiceSuccess<{
        userId: string
    }>>
   
}


export interface IUserRepository {
    findOne : (filter: QueryFilter<IUserSchema>, select?: string) => Promise<IUserSchema | null>;
    // create(payload: IUserSchema): Promise<IUserSchema>;

    create(payload: TCreateUserInput): Promise<IUserSchema>;

    updateOne(filter: QueryFilter<IUserSchema>, update: UpdateQuery<IUserSchema>): Promise<UpdateWriteOpResult>;
}