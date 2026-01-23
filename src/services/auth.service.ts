import { compareValues, hashValue } from "@/helpers/encryption.helper";
import { ServiceSuccess } from "@/helpers/service.helper";
import { IUserRepository, IUserRequestData, IUserService } from "@/interfaces/user.interface";
import { TJwtPayload } from "@/types/jwt.type";
import { AppError } from "@/utils/appError";
import { signJWT } from "@/utils/jwt";
import bcrypt from "bcryptjs";
import config from '../config/index';
import { generateMinutesSeconds } from "@/helpers/date-time.helper";
import { generateOTP, generateRecoveryCodes } from "@/helpers/2fa.helper";
import { create } from "node:domain";
import { createQRCodeDataURL } from "@/helpers/qr.helper";

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


    activate2FA = async (user: IUserRequestData['activate2FA']['user']) => {

        const is2FAActivated = user.twoFactorAuth.activated;
        if (is2FAActivated) {
            throw new AppError('2FA is already activated', 400);
        }

        const totp = generateOTP(user.email)
        const otpAuth = totp.toString();

        const qrDataUrl = await createQRCodeDataURL(otpAuth);

        const secret  = totp.secret.base32;
        const recoveryCodes = await generateRecoveryCodes(10)


        const updatedUser = await this.userRepository.updateOne({
            _id: user.id
        },{
            $set: {
            'twoFactorAuth.secret': secret,
            'twoFactorAuth.recoveryCodes': recoveryCodes.hashed.map((code) => {
                
                return{
                    code,
                    used: false
                };

            })


            }
        })

        if(updatedUser.modifiedCount === 0){
            throw new AppError('Failed to activate 2FA', 500);
        }

        return ServiceSuccess('2FA activation initiated',{
            qrDataUrl,
            recoveryCodes: recoveryCodes.plainText
        });


    };


}