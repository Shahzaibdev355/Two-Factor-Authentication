import { CookieOptions } from "express";
import { generateDaysMilliSeconds, generateMinutesMilliSeconds } from "./date-time.helper";
import config from "@/config";

type TCookieParam = 
{
    purpose: 'auth';
    type: 'minute' | 'day';
    value: number;
} | {purpose: 'logout'}


export const getCookieOptions = (param: TCookieParam) =>{

    const cookieOptions: CookieOptions={
        path: '/',
        httpOnly: true,
        sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax',
    }

    if (param.purpose ===  'auth') {

        let maxAge = 0;

        if (param.type === 'minute') {
            maxAge = generateMinutesMilliSeconds(param.value);
        } else if (param.type === 'day') {
            maxAge = generateDaysMilliSeconds(param.value);
        }

        cookieOptions.maxAge = maxAge;

    }

    if (config.NODE_ENV === 'production') {
        cookieOptions.secure = true;
    }

    return cookieOptions; 
}

