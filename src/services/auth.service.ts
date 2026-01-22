import { hashValue } from "@/helpers/encryption.helper";
import { ServiceSuccess } from "@/helpers/service.helper";
import { IUserRepository, IUserRequestData, IUserService } from "@/interfaces/user.interface";
import bcrypt from "bcryptjs";

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

}