import AppError from "../../errorHelpers/AppError";
import { AgentStatus, IsActive, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs"
import { envVars } from "../../config/env";
import { Wallet } from "../wallet/wallet.model";
import { Status, WalletType } from "../wallet/wallet.interface";
import mongoose from "mongoose";
import { Transaction } from "../transaction/transaction.model";
import { IStatus, IType } from "../transaction/transaction.interfaces";
import { JwtPayload } from "jsonwebtoken";
import { GetAllOptions } from "../../interfaces/paginationInterfaces";





// 
const createUser = async (payload: Partial<IUser>) => {

  console.log("[CREATE USER SERVICE] Full payload:", JSON.stringify(payload));
  
  const { email, password, role, ...rest } = payload;
  
  console.log("[CREATE USER SERVICE] Extracted - Email:", email, "Password:", password, "Role:", role);

  const bonusBalance = 50; // 50 INR in rupees

  if (role === Role.ADMIN || role === Role.AGENT) {
    throw new AppError(httpStatus.BAD_REQUEST, "Can't create Admin/Agent manually");
  }

  // check if user already exists
  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist");
  }

  // hash password - ensure valid salt rounds
  console.log("[CREATE USER] Password value:", password);
  console.log("[CREATE USER] Password type:", typeof password);
  
  if (!password) {
    console.log("[CREATE USER ERROR] Password is undefined or empty");
    throw new AppError(httpStatus.BAD_REQUEST, "Password is required");
  }
  
  const saltRounds = Number(envVars.BCRIPT_SOLT_ROUND) || 10;
  console.log("[CREATE USER] Salt rounds:", saltRounds);
  
  let hashedPassword: string;
  try {
    hashedPassword = await bcrypt.hash(password as string, saltRounds);
    console.log("[CREATE USER] Password hashed successfully");
  } catch (bcryptError: any) {
    console.log("[CREATE USER BCRYPT ERROR]", bcryptError.message);
    throw bcryptError;
  }
  
  
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // create user
    const user = await User.create(
      [{ email, password: hashedPassword, role, ...rest }],
      { session }
    );

    // create user wallet with bonus balance (no system wallet required)
    const wallet = await Wallet.create(
      [{
        user: user[0]._id,
        balance: bonusBalance,
        status: Status.ACTIVE,
        walletType: WalletType.PERSONAL,
      }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return {
      user: user[0],
      wallet: wallet[0],
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};




// ** update user
const updateUser = async(userId: string, payload: Partial<IUser>)=>{
    // 
    const isUserExist = await User.findById(userId);

      if(!isUserExist){
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }
    // 
    if(isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE){
      throw new AppError(httpStatus.FORBIDDEN,`User is ${isUserExist}, Please make your accont active`)
    }

    // 
    if(payload.password){
        const saltRounds = Number(envVars.BCRIPT_SOLT_ROUND) || 10;
        payload.password = await bcrypt.hash(payload.password, saltRounds)
  }
  
  //  send to database
  const newUpdateUser = await User.findByIdAndUpdate(userId, payload, {new:true, runValidators:true})

  return newUpdateUser;

}


// ** update agentstus
const agentStatusUpdate = async (decodedToken: JwtPayload) => {

  const isUserExist = await User.findById(decodedToken.userId);

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }

  if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      `User is ${isUserExist.isActive}, please make your account active`
    );
  }

  if(isUserExist.role=== Role.AGENT){
    throw new AppError(httpStatus.BAD_REQUEST,"Your Are All ready an agent")
  }

  const updatedAgent = await User.findByIdAndUpdate(
    decodedToken.userId,
    { agentStatus: AgentStatus.PENDING },
    { new: true, runValidators: true }
  );

  return updatedAgent;
};




// ** get all users
const getAllUsers = async (options: GetAllOptions = {}) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    searchTerm,
    filters = {},
  } = options;

  const skip = (page - 1) * limit;

  // query
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query: Record<string, any> = { ...filters };

  // add text search across fields
  if (searchTerm) {
    query.$or = [
      { name: { $regex: searchTerm, $options: "i" } },
      { email: { $regex: searchTerm, $options: "i" } },
      { phone: { $regex: searchTerm, $options: "i" } },
    ];
  }

  const users = await User.find(query)
    .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
    .skip(skip)
    .limit(limit);

  const totalUser = await User.countDocuments(query);

  return {
    data: users,
    meta: {
      page,
      limit,
      total: totalUser,
      totalPages: Math.ceil(totalUser / limit),
    },
  };
};



// Get current user
const getCurrentUser = async (email: string) => {
  const user = await User.findOne({ email }).select('-password');
  
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return user;
};


export const UserServices={
    createUser,
    getAllUsers,
    updateUser,
    agentStatusUpdate,
    getCurrentUser


}