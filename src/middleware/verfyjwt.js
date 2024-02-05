import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Jwt  from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandlere.js";

export const verfyjwt= asyncHandler(async(req,res, next)=>{
    try{
          // by the help of cokies check user login or not
          const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","")
         // const token = req.cookie?.accessToken || req.header("Authorization")?.replace('Bearer',"") 
         //console.log(token)  
          if(!token)
          {
            throw new ApiError(400, "Unauthorized request")
          }

          const decodedToken = Jwt.verify(token, process.env.ACCESS_TOKEN_SECRT)

          const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

          if(!user)
          {
            throw new ApiError(401, "Invalid access token")
          }
          req.user= user;
          next()
       }
    catch(error)
    {
        res.send(error.message)
    }
})