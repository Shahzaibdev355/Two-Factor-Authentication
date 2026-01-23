
import jwt from "jsonwebtoken";
import config from "../config/index";
import { IUserSchema } from "../models/user.model";
import { TJwtPayload } from "@/types/jwt.type";


export const signJWT = (payload: TJwtPayload, secret:string, expiresIn: number) => jwt.sign(payload, secret, { expiresIn });

export const verifyJWT = (token: string, secret: string) => jwt.verify(token, secret);






// Generate JWT access token
export const generateToken = (user: IUserSchema): string => {
  return jwt.sign({ id: user._id?.toString() }, config.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Generate JWT refresh token
export const generateRefreshToken = (user: IUserSchema): string => {
  return jwt.sign({ id: user._id?.toString() }, config.JWT_REFRESH_SECRET, {
    expiresIn: "30d",
  });
};

// Verify JWT token

// Verify refresh token
export const verifyRefreshToken = (token: string): any => {
  return jwt.verify(token, config.JWT_REFRESH_SECRET);
};
