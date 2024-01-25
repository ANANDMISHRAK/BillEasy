import { asyncHandler } from "../utils/asyncHandlere.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";


// generate token

const generateAccessAndRefreshToken = async (userid) => {
    try {
     // console.log("in side user registration controller")
      const user = await User.findById(userid)
  
      const accessToken = user.generateAccessToken()
     // console.log(acessToken);
      const refereshToken = user.generateRefreshToken()
     // console.log(refereshToken)
  
      user.refreshToken = refereshToken
     // user.accessToken= accessToken
      //console.log("user.retocken  : ", user.refereshToken)
      await user.save({ validateBeforeSave: false })
  
      return { accessToken, refereshToken }
    }
    catch (error) {
      throw new ApiError(500, "somethis went wrong while generate Access or Referesh Token")
    }
  }
  
//register user

const registerUser = asyncHandler(async(req, res)=>{
    try{
          // take ip from user
          const{username, email, password}= req.body 

          if([username, email, password].some((field)=> field?.trim() === ""))
          {
            throw new ApiError(401, "all field are required")
          }

          // check user all ready exist or not
          const existUser= await User.findOne(username)

          if(existUser)
          {
            throw new ApiError(401, " user allready exist")
          }

          const user = await User.create({
            username: username.tolowercase(),
            email,
            password 
          })

          const createdUser = await User.findById(user._id).select("-password")
          if(!createdUser)
          {
            throw new ApiError(401, "Not regitered")
          }

       return res.status(200).json( new ApiResponse(200, user, "Registered successfully"))
          
       }
    catch(error){
        if(err instanceof ApiError)
        {
           res.send(error.message)
        }
    }
})

//login
const loginUser = asyncHandler(async(req, res)=>
{
    try{
          const {username, password}= req.body
          
          if(!username || !password)
          {
            throw new ApiError(401, "field is required")
          }

          const user = await User.findOne(username)
          if(!user)
          {
            throw new ApiError(401, "user not exist, go for register")
          }

          const isPassword = await user.isPasswordCorrect(password)

          if(!isPassword)
          {
            throw new ApiError(401, "Password is wrong")
          }
    const {accessToken, refreshToken}= await generateAccessAndRefreshToken(user._id)

    const loginUser = await User.findById(user._id).select("-password")

    return res.status(200).json(new ApiResponse(200, loginUser, "user login sucessfully"))

       }
    catch(error)
    {
        if(error instanceof ApiError)
        {
            res.send(error.message)
        }
    }
})

export {
    registerUser,
    loginUser

}