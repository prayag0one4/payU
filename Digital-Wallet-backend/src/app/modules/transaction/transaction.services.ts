import { JwtPayload } from "jsonwebtoken";
import { IStatus, ITransaction, IType } from "./transaction.interfaces"
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes"
import { Wallet } from "../wallet/wallet.model";
import { Status, WalletType } from "../wallet/wallet.interface";
import { startSession } from "mongoose";
import { Transaction } from "./transaction.model";
import { User } from "../user/user.model";
import { GetAllOptions } from "../../interfaces/paginationInterfaces";



// ** send money
const sendMoney = async(decodedToken:JwtPayload, payload:Partial<ITransaction>)=>{
       
    const session =await startSession();
    session.startTransaction();
      

    //   
     const {to, amount, notes} = payload;
    // amount in rupees
    const amountInRupees = amount as number;
    const feeInRupees = 5; // send money fee 5 rupees

    
    //  find sender wallet
     const senderWallet = await Wallet.findOne({user:decodedToken.userId}).session(session);
     
     // validation 1   
     if(!senderWallet || senderWallet.walletType === WalletType.AGENT){
            throw new AppError(httpStatus.BAD_REQUEST, !senderWallet? "Sender wallet not found": `${senderWallet.walletType} Account cannot perform sendMoney`)
        }

    // find receiver wallet
     const receiverUser = await User.findOne({email:to});
     const receiverWallet = await Wallet.findOne({user:receiverUser?._id}).session(session);

      // validation 2 
     if(!receiverWallet){
        throw new AppError(httpStatus.NOT_FOUND,"Receiver wallet not found")
     }
     
    // validation 3  blocked check
    if(senderWallet.status ===Status.BLOCKED || receiverWallet.status === Status.BLOCKED){
        throw new AppError(httpStatus.BAD_REQUEST, `${senderWallet.status === Status.BLOCKED && senderWallet.walletType} ${receiverWallet.status === Status.BLOCKED && receiverWallet} wallet Is Blocked`)  
    }
     
    // validation 4
    if((senderWallet.balance ?? 0) < (amountInRupees + feeInRupees)){
      throw new AppError(httpStatus.BAD_REQUEST,"Insufficient balance")
    }
     
    // 
    const adminWallet = await Wallet.findOne({ walletType: WalletType.SYSTEM }).session(session);
    if (!adminWallet) {
        throw new AppError(httpStatus.NOT_FOUND, "Admin wallet not found");
    }


    // ** deduct from sender wallet and add to receiver
    const totalDebit = Number(amountInRupees + feeInRupees)!;
    console.log(`[SEND MONEY] Sender debit: ${totalDebit} (amount: ${amountInRupees}, fee: ${feeInRupees})`);
    console.log(`[SEND MONEY] Receiver credit: ${amountInRupees}`);
    console.log(`[SEND MONEY] Admin credit: ${feeInRupees}`);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    senderWallet.balance! -= totalDebit;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    receiverWallet.balance! += Number(amountInRupees)!
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    adminWallet.balance! += Number(feeInRupees)!

    // 
    await senderWallet.save({session});
    await receiverWallet.save({session});
    await adminWallet.save({session});

    // transaction
    const transaction = await Transaction.create([
         {
          type:IType.SEND,
          from:senderWallet._id,
          to:receiverWallet._id,
          amount:amountInRupees,
          fee:feeInRupees,
          commission:0,
          tranStatus:IStatus.COMPLETED,
          initiatedBy:senderWallet._id,
          notes
         },
    ],
    { session }
)
    
// commit transaction
await session.commitTransaction();
session.endSession();
return transaction[0]

}




// ** cash in
const cashIn = async(decodedToken:JwtPayload, payload:Partial<ITransaction>)=>{
    // 
    const session =await startSession();
    session.startTransaction();
    // 
    const {to, amount} = payload; 
     // amount in rupees
    const amountInRupees = amount as number;
    const commission = Math.round((amountInRupees * 2) / 100); //2% commission
    
    // sender wallet
    const senderWallet = await Wallet.findOne({user:decodedToken.userId}).session(session);
    // ** validation 1
    if(!senderWallet || senderWallet.walletType === WalletType.PERSONAL){
        throw new AppError(httpStatus.BAD_REQUEST, !senderWallet? "Sender wallet not found": `${senderWallet.walletType} user cannot process cash-in`)
    }
    // validation 2
    const receiverUser = await User.findOne({email:to});
    const receiverWallet = await Wallet.findOne({user:receiverUser?._id}).session(session);
      // 
      if(!receiverWallet || receiverWallet.walletType === WalletType.AGENT){
        throw new AppError(httpStatus.NOT_FOUND,!receiverWallet? "Receiver wallet not found": `${receiverWallet.walletType} cannot receive cash-in money`)
     }

    // validation 3  blocked check
    if(senderWallet.status ===Status.BLOCKED || receiverWallet.status === Status.BLOCKED){
       throw new AppError(httpStatus.BAD_REQUEST, `${senderWallet.status === Status.BLOCKED && senderWallet.walletType} ${receiverWallet.status === Status.BLOCKED && receiverWallet} wallet Is Blocked`)  
    }
    
    // validation 4
    if((senderWallet.balance ?? 0) < (amountInRupees)){ throw new AppError(httpStatus.BAD_REQUEST,"Insufficient balance")
    } 

    const adminWallet = await Wallet.findOne({ walletType: WalletType.SYSTEM }).session(session);
    if (!adminWallet) {
        throw new AppError(httpStatus.NOT_FOUND, "Admin wallet not found");
    }

    // deduct from sender/agent adding to personal user
    const receiverCredit = Number(amountInRupees - commission)!;
    console.log(`[CASH IN] Agent debit: ${amountInRupees}`);
    console.log(`[CASH IN] User credit: ${receiverCredit} (amount: ${amountInRupees}, commission: ${commission})`);
    console.log(`[CASH IN] Admin credit: ${commission}`);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    senderWallet.balance! -= Number(amountInRupees)!; 
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    receiverWallet.balance! += receiverCredit;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    adminWallet.balance! += Number(commission)!
    
    // 
    await senderWallet.save({session});
    await receiverWallet.save({session});
    await adminWallet.save({session})

    // transaction
    const transaction = await Transaction.create([
         {
          type:IType.CASH_IN,
          from:senderWallet._id,
          to:receiverWallet._id,
          amount:amountInRupees,
          fee:0,
          commission:commission,
          tranStatus:IStatus.COMPLETED,
          initiatedBy:senderWallet._id
         },
    ],
    { session }
    
)
// commit transaction
await session.commitTransaction();
session.endSession();
return transaction[0]

}




// * withdraw money
const withdrawMoney = async(decodedToken:JwtPayload, payload:Partial<ITransaction>)=>{
         // 
    const session =await startSession();
    session.startTransaction();

    // 
    const {to, amount, notes} = payload; 
    // amount in rupees
    const amountInRupees = amount as number;
    const feeInRupees = Math.round(amountInRupees * 0.015); // 1.5% fee
    const commission = Math.round((feeInRupees * 15) / 100); // 15% of fee for agent commission
    const afterCommission = feeInRupees - commission;

    
    // sender wallet for withdraw
    const senderWallet = await Wallet.findOne({user:decodedToken.userId}).session(session);
    // ** validation 1
    if(!senderWallet || senderWallet.walletType === WalletType.AGENT){
        throw new AppError(httpStatus.BAD_REQUEST, !senderWallet? "Sender wallet not found": `${senderWallet.walletType} cannot proceed withdraw`)
    }
    
    // For withdraw to agents - we don't require agent wallet to exist
    // The transaction is recorded but agent doesn't need to have an account
    
    // validation 3  blocked check
    if(senderWallet.status ===Status.BLOCKED){
       throw new AppError(httpStatus.BAD_REQUEST, `This wallet is blocked`)  
    }
    // amount check
    if(amountInRupees < 50){
        throw new AppError(httpStatus.BAD_REQUEST,"Minimum withdraw is 50 rupees")
    }
    // validation 4
    if((senderWallet.balance ?? 0) < (amountInRupees + feeInRupees)){
      throw new AppError(httpStatus.BAD_REQUEST,"Insufficient balance")
    } 

    // 
    const adminWallet = await Wallet.findOne({ walletType: WalletType.SYSTEM }).session(session);
    if (!adminWallet) {
        throw new AppError(httpStatus.NOT_FOUND, "Admin wallet not found");
    }

    // deduct from sender - agent withdrawal doesn't credit agent wallet, just records transaction
    const userDebit = Number(amountInRupees + feeInRupees)!;
    console.log(`[WITHDRAW] User debit: ${userDebit} (amount: ${amountInRupees}, fee: ${feeInRupees})`);
    console.log(`[WITHDRAW] Admin credit: ${feeInRupees}`);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    senderWallet.balance! -= userDebit; 
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    adminWallet.balance! += Number(feeInRupees)!

    await senderWallet.save({session});
    await adminWallet.save({session});


    // transaction - to field can be null/undefined for agent withdrawals
    const transaction = await Transaction.create([
         {
          transactionId: `TXN-${Date.now()}`,
          type:IType.WITHDRAW,
          from:senderWallet._id,
          to:null, // No agent wallet needed
          amount:amountInRupees,
          fee:feeInRupees,
          commission:0,
          tranStatus:IStatus.COMPLETED,
          initiatedBy:senderWallet._id,
          notes
         },
    ],
    { session }
    )
    // commit transaction
    await session.commitTransaction();
    session.endSession();
    return transaction[0]

    
}




// * get my transaction
const getMyTransactions = async (
  decodedToken: JwtPayload,
  options: GetAllOptions
) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    filters = {},
  } = options;

  const skip = (page - 1) * limit;

  // Check user
  const isUserExist = await User.findById(decodedToken.userId);
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }

  // Check wallet
  const isWalletExists = await Wallet.findOne({ user: isUserExist._id });
  if (!isWalletExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet Not Found");
  }

  // Blocked wallet check
  if (isWalletExists.status === Status.BLOCKED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This ${isWalletExists.walletType} wallet is blocked`
    );
  }

  // Fetch transactions
  const query = {
    $or: [
      { to: isWalletExists._id },
      { from: isWalletExists._id },
    ],
    ...filters, // optional extra filters
  };

  const transactions = await Transaction.find(query)
    .populate('from', '_id user balance walletType')
    .populate('to', '_id user balance walletType')
    .populate('initiatedBy', '_id name email')
    .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
    .skip(skip)
    .limit(limit);

  const total = await Transaction.countDocuments(query);

  return {
    data: transactions,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};



// * get my transaction
const getAllTransactions = async (options:GetAllOptions) => {

// 
const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    filters = {},
 } = options;

    
  const skip = (page - 1) * limit;

    // Build query
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query: Record<string, any> = { ...filters };

  const transactions = await Transaction.find(query)
    .populate('from', '_id user balance walletType')
    .populate('to', '_id user balance walletType')
    .populate('initiatedBy', '_id name email')
    .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
    .skip(skip)
    .limit(limit);

  const total = await Transaction.countDocuments(query);

  return {
    data: transactions,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};



// ** add money (simulate payment gateway - for demo purposes)
const addMoney = async(decodedToken:JwtPayload, payload:Partial<ITransaction>)=>{
    const session = await startSession();
    session.startTransaction();

    try {
        const { amount } = payload;
        const amountInRupees = amount as number;

        // Find user's wallet
        const userWallet = await Wallet.findOne({user: decodedToken.userId}).session(session);

        if (!userWallet) {
            throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
        }

        if (userWallet.status === Status.BLOCKED) {
            throw new AppError(httpStatus.BAD_REQUEST, "Your wallet is blocked");
        }

        // Get system wallet
        const systemWallet = await Wallet.findOne({ walletType: WalletType.SYSTEM }).session(session);
        if (!systemWallet) {
            throw new AppError(httpStatus.NOT_FOUND, "Admin wallet not found");
        }

        // Add money to user wallet
        userWallet.balance += amountInRupees;
        await userWallet.save({session});

        // Create transaction record
        const transaction = await Transaction.create([{
            type: IType.BONUS,
            from: systemWallet._id,
            to: userWallet._id,
            amount: amountInRupees,
            fee: 0,
            commission: 0,
            tranStatus: IStatus.COMPLETED,
            initiatedBy: decodedToken.userId,
            notes: "Money added to wallet"
        }], { session });

        await session.commitTransaction();
        session.endSession();
        
        return transaction[0];
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
}



export const TransactionServices = {
        sendMoney,
        cashIn,
        getMyTransactions,
        getAllTransactions,
        withdrawMoney,
        addMoney
}