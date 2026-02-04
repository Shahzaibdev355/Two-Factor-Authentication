import mongoose, { Document, Schema } from "mongoose";

import { IUserSchema } from "../models/user.model";
import { Request } from "express";

export interface RegisterUserInput {

    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNo: number;

}


export interface LoginUserInput {

    email: string;
    password: string;

}





export interface IAuthenticateRequest extends Request {
    cookies: {
        accessToken: string
    };
    user: IUserSchema;
}