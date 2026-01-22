// import mongoose, { Document, Schema } from "mongoose";
import mongoose, { Document, Schema, HydratedDocument } from "mongoose";
import bcrypt from "bcryptjs";

type TTwoFactorAuthRecoveryCodes = {
    used: boolean;
    code: string;
}


type TTwoFactorAuth = {
    activated: boolean;
    secret?: string | null;
    recoveryCodes: TTwoFactorAuthRecoveryCodes[];
}


export interface IUserSchema extends Document {

    id?: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNo: number;

    twoFactorAuth: TTwoFactorAuth;
    createdAt: Date;
    updatedAt: Date;
    matchPassword(enteredPassword: string): Promise<boolean>;

}


const twoFactorAuthRecoveryCodeSchema = new Schema<IUserSchema["twoFactorAuth"]["recoveryCodes"][0]>(

    {
        code: {
            type: String,
            required: true,
        },
        used: {
            type: Boolean,
            required: true,
            default: false,
        }
    },
    { id: false }

)

const twoFactorAuthSchema = new Schema<IUserSchema["twoFactorAuth"]>(

    {
        activated: {
            type: Boolean,
            required: true,
            default: false,
        },
        secret: {
            type: String,
            required: false,
            default: null,
        },
        recoveryCodes: {
            type: [twoFactorAuthRecoveryCodeSchema],
            required: true,
            select: false,
            default: [],
        }

    },
    { id: false }

)






const UserSchema = new Schema<IUserSchema>(
    {
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters"],
            select: false, // Don't return password in queries by default
        },
        firstName: {
            type: String,
            required: [true, "First name is required"],
            trim: true,
        },
        lastName: {
            type: String,
            required: [true, "Last name is required"],
            trim: true,
        },

        phoneNo: {
            type: Number,
            required: [true, "Phone No. is required"]        
        },

        twoFactorAuth: {
            type: twoFactorAuthSchema,
            required: true,
        }


    },
    {
        timestamps: true,
    }
)



// Encrypt password before saving



// UserSchema.pre(
//     "save",
//     async function (this: HydratedDocument<IUserSchema>) {
//       if (!this.isModified("password")) {
//         return;
//       }
  
//       const salt = await bcrypt.genSalt(10);
//       this.password = await bcrypt.hash(this.password, salt);
//     }
//   );
  



// Compare entered password with stored hash
// UserSchema.methods.matchPassword = async function (
//     enteredPassword: string
// ): Promise<boolean> {
//     return await bcrypt.compare(enteredPassword, this.password);
// };

export const User = mongoose.model<IUserSchema>("plant_user", UserSchema);













