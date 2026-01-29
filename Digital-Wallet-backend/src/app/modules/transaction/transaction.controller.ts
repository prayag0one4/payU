/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { responseSender } from "../../utils/responseSender";
import httpStatus from "http-status-codes";
import { TransactionServices } from "./transaction.services";
import { JwtPayload } from "jsonwebtoken";




// ** sendMoney
const sendMoney = catchAsync(async(req:Request, res:Response , next:NextFunction)=>{
   
    // 
     const decodedToken = req.user;
     const result = await TransactionServices.sendMoney(decodedToken as JwtPayload , req.body);
  //
 responseSender(res, {
   success:true,
   statusCode:httpStatus.CREATED,
   message:"Send Money succesfully",
   data:result
})

});

// ** cashIn
const cashIn = catchAsync(async(req:Request, res:Response , next:NextFunction)=>{
//    
  const decodedToken = req.user;
  const result = await TransactionServices.cashIn(decodedToken as JwtPayload , req.body);
 
  //
 responseSender(res, {
   success:true,
   statusCode:httpStatus.CREATED,
   message:"Cash In succesfully",
   data:result
})

});


// ** withdraw
const withdrawMoney = catchAsync(async(req:Request, res:Response , next:NextFunction)=>{
  
  const decodedToken = req.user;

  const result = await TransactionServices.withdrawMoney(decodedToken as JwtPayload, req.body);
 
  //
 responseSender(res, {
   success:true,
   statusCode:httpStatus.CREATED,
   message:"Money withdraw succesfully",
   data:result
})

});




// ** getMyTransactions
const getMyTransactions = catchAsync(async(req:Request, res:Response , next:NextFunction)=>{
    
  console.log("[GET MY TRANSACTIONS] Query params:", req.query);
  console.log("[GET MY TRANSACTIONS] User:", req.user);
  
  //   
  const decodedToken = req.user;

  const { page, limit, sortBy, sortOrder, ...filters} = req.query;
 
  console.log("[GET MY TRANSACTIONS] Extracted params - page:", page, "limit:", limit);
  
  //   
  const result = await TransactionServices.getMyTransactions(decodedToken as JwtPayload,
    { 
    page: Number(page) || 1,
    limit: Number(limit) || 10,
    sortBy: (sortBy as string) || "createdAt",
    sortOrder: (sortOrder as "asc" | "desc") || "desc",
    filters,
  });
 
  console.log("[GET MY TRANSACTIONS] Result:", result);
  
  //
 responseSender(res, {
   success:true,
   statusCode:httpStatus.OK,
   message:"Transaction retrived succesfully",
   meta:result.meta,
   data:result.data
})

});


// ** getAllTransactions
const getAllTransactions = catchAsync(async(req:Request, res:Response , next:NextFunction)=>{

  const { page, limit, sortBy, sortOrder, ...filters} = req.query;
  //   
  const result = await TransactionServices.getAllTransactions({
    page: Number(page) || 1,
    limit: Number(limit) || 10,
    sortBy: (sortBy as string) || "createdAt",
    sortOrder: (sortOrder as "asc" | "desc") || "desc",
    filters,
  });
 
  //
 responseSender(res, {
   success:true,
   statusCode:httpStatus.OK,
   message:"All Transactions Reterived Successfully",
   meta:result.meta,
   data:result.data
})

});


// ** addMoney
const addMoney = catchAsync(async(req:Request, res:Response , next:NextFunction)=>{
  const decodedToken = req.user;
  const result = await TransactionServices.addMoney(decodedToken as JwtPayload, req.body);
 
  //
 responseSender(res, {
   success:true,
   statusCode:httpStatus.CREATED,
   message:"Money added successfully",
   data:result
})

});


export const TransactionController = {
      sendMoney,
      cashIn,
      withdrawMoney,
      getMyTransactions,
      getAllTransactions,
      addMoney
}