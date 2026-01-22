import mongoose, { Document, Schema } from "mongoose";

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


