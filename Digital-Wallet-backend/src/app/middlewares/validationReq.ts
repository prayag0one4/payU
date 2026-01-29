import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";


export const validationRequest =(zodSchema:ZodObject)=> async(req:Request, res:Response, next:NextFunction)=>{

try{
    console.log("[VALIDATION MIDDLEWARE] Path:", req.path);
    console.log("[VALIDATION MIDDLEWARE] Raw body:", JSON.stringify(req.body));
    req.body = await zodSchema.parseAsync(req.body);
    console.log("[VALIDATION MIDDLEWARE] Validated body:", JSON.stringify(req.body));
    next();

  }catch(err:any){
    console.log("[VALIDATION ERROR]", err.errors || err.message);
    next(err)
 }


}