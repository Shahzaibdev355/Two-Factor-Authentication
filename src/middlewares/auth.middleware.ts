import config from "../config"
import { IUserRepository } from "../interfaces/user.interface"
import { IAuthenticateRequest } from "../types/auth.types"
import { TJwtPayload } from "../types/jwt.type"
import { AppError } from "../utils/appError"
import { verifyJWT } from "../utils/jwt"
import { RequestHandler } from "express"



type TAuthMiddleWareParam = {
    stage: ('password' | '2fa')[],
    repositories: {
        userRepository: IUserRepository
    }
}

export const authMiddleware = (params: TAuthMiddleWareParam): RequestHandler => async (_req, res, next) => {
    try {
        const req = _req as IAuthenticateRequest
        
        // Try to get token from cookies first, then from Authorization header
        let accessToken = req.cookies?.accessToken
        
        if (!accessToken) {
            const authHeader = req.headers.authorization
            if (authHeader && authHeader.startsWith('Bearer ')) {
                accessToken = authHeader.substring(7)
            }
        }

        console.log('Auth middleware - Token found:', !!accessToken)
        console.log('Auth middleware - Cookies:', Object.keys(req.cookies || {}))
        console.log('Auth middleware - Auth header:', !!req.headers.authorization)

        if (!accessToken) {
            return next(new AppError('Unauthorized', 401))
        }

        const jwtPayload = verifyJWT(accessToken, config.JWT_SECRET) as TJwtPayload

        let isAuthenticated = false
        if (params.stage.includes(jwtPayload.stage)) {
            isAuthenticated = true
        }

        if (isAuthenticated) {
            const user = await params.repositories.userRepository.findOne({_id: jwtPayload.userId}, '+twoFactorAuth.secret')
            if (user) {
                req.user = user
                res.setHeader('X-Auth-Stage', jwtPayload.stage)
                return next()
            }
        }

        next(new AppError('Unauthorized', 401))
    } catch (error) {
        console.error('Auth middleware error:', error)
        next(new AppError('Unauthorized', 401))
    }
}