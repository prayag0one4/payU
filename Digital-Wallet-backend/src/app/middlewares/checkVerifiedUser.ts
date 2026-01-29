import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";
import httpStatus from "http-status-codes"
import { IsActive } from "../modules/user/user.interface";



export const checkVerified = (...authRoles:string[])=>(async(req:Request, res:Response, next:NextFunction)=>{
    
    try {
         // Check cookies first, then Authorization header
         let token = req.cookies?.accessToken;
         
         if (!token) {
           const authHeader = req.headers.authorization;
           if (authHeader && authHeader.startsWith('Bearer ')) {
             token = authHeader.slice(7);
           }
         }
         
          if(!token){
        throw new AppError(401, "Authentication required. Please login.")
      }
      
      const verifiedToken = verifyToken(token, envVars.JWT_ACCESS_SECRET) as JwtPayload;

       const isUserExist = await User.findOne({email:verifiedToken.email});
        //   
        if(!isUserExist){
            throw new AppError(httpStatus.BAD_REQUEST, "Email Does Not exist")
        }  
         //  
        if(isUserExist.isActive === IsActive.BLOCKED){
         throw new AppError(httpStatus.BAD_REQUEST, `user is ${isUserExist.isActive}`)
        }  

         // if role is no right
        if(!authRoles.includes(verifiedToken.role)){
            throw new AppError(403, "Role not permitted to access this route")
        }
          // 
        req.user = verifiedToken;


        // 
        next();
       //   
    } catch (error) {
        // Pass the error to global error handler
        next(error) 
    }


})