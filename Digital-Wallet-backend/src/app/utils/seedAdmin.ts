/* eslint-disable no-console */
import { envVars } from "../config/env";
import { IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcrypt from "bcryptjs"
import { Wallet } from "../modules/wallet/wallet.model";
import { Status, WalletType } from "../modules/wallet/wallet.interface";



export const seedAdmin =async()=>{
    // 
      try{
        // Migrate existing wallets to INR if they still have BDT
        const walletsWithBDT = await Wallet.find({ currency: "BDT" });
        if (walletsWithBDT.length > 0) {
          await Wallet.updateMany({ currency: "BDT" }, { currency: "INR" });
          console.log(`Migrated ${walletsWithBDT.length} wallets from BDT to INR`);
        }

        // Migrate wallet balances from paise to rupees (divide by 100)
        // This checks if any wallet has a balance > 1000 (likely in paise)
        const walletsInPaise = await Wallet.find({ balance: { $gt: 1000 } });
        if (walletsInPaise.length > 0) {
          await Wallet.updateMany(
            { balance: { $gt: 1000 } },
            [{ $set: { balance: { $divide: ["$balance", 100] } } }]
          );
          console.log(`Migrated ${walletsInPaise.length} wallets from paise to rupees`);
        }

        const isSuperAdminExist = await User.findOne({email:envVars.ADMIN_EMAIL});
        // 
        if(isSuperAdminExist){
            console.log("Super Admin alredy exists");
            return 
        }

    // hasded pass by bcript
        const saltRounds = Number(envVars.BCRIPT_SOLT_ROUND) || 10;
        const hashedPassword = await bcrypt.hash(envVars.ADMIN_PASS, saltRounds);
        //  

    // 
    const payLoad:IUser = {
        name:"Admin",
        email:envVars.ADMIN_EMAIL,
        role:Role.ADMIN,
        isVerified:true,
        password:hashedPassword,
    }
      //    
      const Admin = await User.create(payLoad);
      console.log("Admin Created Successfully! \n");
    //   console.log(Admin);
      
      await Wallet.create({
            user:Admin._id,
            balance:50000,
            status:Status.ACTIVE,
            walletType:WalletType.SYSTEM
      })


      }catch(err){
        console.log(err);
      }
}