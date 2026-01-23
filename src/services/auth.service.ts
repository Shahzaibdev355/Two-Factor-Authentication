import { compareValues, hashValue } from "@/helpers/encryption.helper";
import { ServiceSuccess } from "@/helpers/service.helper";
import { IUserRepository, IUserRequestData, IUserService } from "@/interfaces/user.interface";
import { TJwtPayload } from "@/types/jwt.type";
import { AppError } from "@/utils/appError";
import { signJWT } from "@/utils/jwt";
import bcrypt from "bcryptjs";
import config from '../config/index';
import { generateMinutesSeconds } from "@/helpers/date-time.helper";

export default class UserService implements IUserService {
    // Implementation of user service methods would go here
    constructor(private userRepository: IUserRepository) {
        //
    }

    register = async (payload: IUserRequestData['register']['body']) => {
       
        // find already exist user
        const user = await this.userRepository.findOne({
            email: payload.email
        })
        if(user){
            throw new Error('User already exists with this email');
        }

        // hash password
        const hashPassword = await hashValue(payload.password);

        // create user
        const newUser = await this.userRepository.create({
            email: payload.email,
            password: hashPassword,
            firstName: payload.firstName,
            lastName: payload.lastName,
            phoneNo: payload.phoneNo,
            twoFactorAuth: {
                activated: false,
                secret: null,
                recoveryCodes: []
            }
        });


        return ServiceSuccess('User registered',{
            userId: String(newUser.id)
        });

    };


    login = async (payload: IUserRequestData['login']['body']) => {

        // find already exist user
        const user = await this.userRepository.findOne(
            {
            email: payload.email
            },
            '+password'
        )
        if(!user){
            throw new AppError('Invalid credentials', 400);
        }

        const enteredPassword = payload.password;
        const hashedPassword = user.password;

        const isPasswordMatch = await compareValues(enteredPassword, hashedPassword);
        if (!isPasswordMatch) {
            throw new AppError('Invalid credentials', 400);
        }

        const tokenPayload : TJwtPayload ={
            userId: String(user.id),
            stage: 'password'
        }

        const accessToken = signJWT(tokenPayload, config.JWT_SECRET , generateMinutesSeconds(5));
        return ServiceSuccess('User logged in',{
            userId: String(user.id),
            accesstoken: accessToken
        });

    };
}