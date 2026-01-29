import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { envVars } from "../config/env";


// 
// eslint-disable-next-line @typescript-eslint/no-explicit-any, no-unused-vars, @typescript-eslint/no-unused-vars
export const globalErrorHandler =(err:any, req:Request, res:Response, next:NextFunction)=>{

    // Only log in development to reduce noise
    if (envVars.NODE_ENV === "development") {
        console.log("[ERROR HANDLER]", {
            path: req.path,
            method: req.method,
            error: err.message || err,
        });
    }

    // 
    let statusCode = 500;
    let message = `Something went wrong ${err.message} catch on global err handler `
     
      if(err instanceof AppError){
          statusCode = err.statusCode;
          message = err.message;
      }else if(err instanceof Error){
          statusCode = 500;
          message = err.message;
      }

      // Handle JWT specific errors with better messages
      if (err.name === 'TokenExpiredError') {
          statusCode = 401;
          message = 'Your session has expired. Please login again.';
      } else if (err.name === 'JsonWebTokenError') {
          statusCode = 401;
          message = 'Invalid authentication token. Please login again.';
      }

    //  
    res.status(statusCode).json({
        success:false,
        message,
        // stack used for showing which line error come from 
        stack:envVars.NODE_ENV === "development" ? err.stack : null
    })
}