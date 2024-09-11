import express, {Request, Response} from "express";
import { User } from "../entity/User";
import { AppDataSource } from "../data-source"
const router =express();
import axios from 'axios';
const jwt =require("jsonwebtoken")
const USER_ID = '26449';
const API_KEY = '4TIOoxVvwUiSUY61Bm2z';
const SENDER_ID = 'NotifyDEMO';

let OTP: string;
let user: User;

router.post('/signUp', async (req: Request, res: Response) => {
  try {
    const mobileNo = req.body.mobileNo;
    const formattedMobileNo = `94${mobileNo.substring(1)}`;
    // console.log(formattedMobileNo)
    // const userExist = await AppDataSource.manager.findOne(User, { where: { mobileNo: mobileNo } });
    // console.log(userExist !== null);
    // if (userExist !== null) {
    //   return res.status(400).json({ msg: "User with the same number already exists! Please check" });
    // }
    try {
      const userExist = await AppDataSource.manager.findOne(User, { where: { mobileNo: mobileNo } });
    
      if (userExist) {
        console.log('User exists:', userExist);
      } else {
        console.log('User does not exist');
      }
    } catch (error) {
      console.error('Error checking user existence:', error);
    }
    
    user = new User();
    user.mobileNo = mobileNo;

    let digits = "0123456789";
    OTP = "";
    for (let i = 0; i < 4; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    console.log(OTP);
    const notifyUrl = 'https://app.notify.lk/api/v1/send';

    const notifyData = {
      user_id: USER_ID,
      api_key: API_KEY,
      sender_id: SENDER_ID,
      to: formattedMobileNo,
      message: `Your OTP is: ${OTP}`,
    };
   
    // await axios.post(notifyUrl, notifyData, {
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // });
   

    return res.status(200).json({ msg: "Message Sent" });
  } catch (error) {
    return res.send(error)
  }
});


router.post('/signIn', async (_req : Request, res : Response) =>{
    try {
       const mobileNo=_req.body;
       const userExist=await User.findOne({where : mobileNo});

       if(!userExist){
        return res
               .status(400)
               .json({msg: "User is not exists! Please signUp"})
       }

        user = new User();
        user.mobileNo = mobileNo;    

       let digits = "0123456789"
       OTP = "";
       for(let i=0; i<4; i++){
        OTP +=digits[Math.floor(Math.random() *10)]
       }

       const notifyUrl = 'https://app.notify.lk/api/v1/send';

        const notifyData = {
        user_id: USER_ID,
        api_key: API_KEY,
        sender_id: SENDER_ID,
        to: mobileNo,
        message: `Your OTP is: ${OTP}`,
        };

        await axios.post(notifyUrl, notifyData, {
        headers: {
            'Content-Type': 'application/json',
        },
        });

        return res.status(200).json({ msg: "Message Sent" });

      
      
    } catch(error){
        return res.send(error)
    }
});


export default router;

