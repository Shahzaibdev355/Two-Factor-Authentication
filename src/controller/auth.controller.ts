import { getCookieOptions } from "@/helpers/cookie.helper";
import { IUserController, IUserRequestData, IUserService } from "@/interfaces/user.interface";
import { loginSchema, registerSchema } from "@/validators/auth.validators";
import { RequestHandler } from "express";



export default class UserController implements IUserController {
    // Implementation of user controller methods would go here

    constructor (private userService: IUserService) {
        //
    }

    register: RequestHandler = async (req, res, next) => {
        try {
            const body = req.body as IUserRequestData['register']['body'];

            const { value, error } = registerSchema.validate(body);
            if (error){
                next(error)
                return
            }

            const response = await this.userService.register(value);
            res.status(201).json(response);

           
        } catch (error) {
            next(error);
        }
    }



    login: RequestHandler = async (req, res, next) => {
        try {
            const body = req.body as IUserRequestData['login']['body'];

            const { value, error } = loginSchema.validate(body);
            if (error){
                next(error)
                return
            }

            const response = await this.userService.login(value);

            const cookieOptions = getCookieOptions({purpose: 'auth', type: 'minute', value: 5}) 
            res.cookie('accesstoken', response.data.accesstoken, cookieOptions);
            res.status(200).json(response);

           
        } catch (error) {
            next(error);
        }
    }

}   