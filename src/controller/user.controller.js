import { asyncHandler } from "../utils/asyncHandlere.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Ordcer } from "../models/order.model.js";


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
 //  console.log(email, username, password)
          // check user all ready exist or not
          const existUser= await User.findOne({email})
    // console.log(existUser)
          if(existUser)
          {
            throw new ApiError(401, " user allready exist")
          }
 // console.log("go for save")
          const user = await User.create({
            username: username.toLowerCase(),
            email,
            password 
          })

          const createdUser = await User.findById(user._id).select("-password")
          if(!createdUser)
          {
            throw new ApiError(401, "Not regitered")
          }
  //console.log("go return")
       return res.status(200).json( new ApiResponse(200, createdUser, "Registered successfully"))
          
       }
    catch(error){
        if(error instanceof ApiError)
        {
           res.send(error.message)
        }
    }
})

//login
const loginUser = asyncHandler(async(req, res)=>
{
    try{
          const {email, password}= req.body
          
          if(!email || !password)
          {
            throw new ApiError(401, "field is required")
          }

          const user = await User.findOne({email})
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

    const options ={
                     httpOnly:true,
                     secure: true
                   }

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, {user: loginUser, accessToken, refreshToken}, "user login sucessfully"))

       }
    catch(error)
    {
        if(error instanceof ApiError)
        {
            res.send(error.message)
        }
    }
})

// logOut
const logOutUser = asyncHandler(async(req, res)=>{
   try{
          // clear cookies and remove refresh token from User document
           await User.findByIdAndUpdate(
                                          req.user?._id,
                                          {
                                            $unset:{
                                                   refreshToken:1
                                                 }
                                          },
                                          {
                                            new : true
                                          }
                                       )

          const options = {
                            httpOnly: true,
                            secure: true
                          }

         return res.status(200)
          .clearCookie("accessToken", options)
          .clearCookie("refereshToken", options)
          .json(new ApiResponse(200, {}, "User Logouted"))
      }
    catch(error)
    {
      if(error instanceof ApiError)
      {
         res.send(error.message)
      }
    }
})

// update user -> username
const updateUser = asyncHandler(async(req, res)=>
{
  try{
       const {username}= req.body 
       if(!username)
       {
        throw new ApiError(401, "username is required")
       }
   console.log(username)
       // user is Authorized to update
       const userDb= await User.findById(req.user?._id)

       if(!userDb)
       {
        throw new ApiError(401, "user is not Authorized to update")
       }

      const updateuser= await User.findByIdAndUpdate(
                                                       userDb._id,
                                                       {
                                                        $set: {
                                                                username
                                                              }
                                                       },
                                                       {
                                                        new : true
                                                       }
                                                    )
        if(!updateuser)
        {
          throw new ApiError(401, "Not updated username")
        }

        return res.status(200)
        .json (new ApiResponse(200, updateuser, "successfully updated"))
     }
  catch(error)
  {
    if(error instanceof ApiError)
    {
      res.send(error.message)
    }
  }
})

// Delete user
const deleteUser= asyncHandler(async(req, res)=>{
  try{
      const deleteuser= await User.findByIdAndDelete(req.user?._id)
        if(!deleteuser)
        {
          throw new ApiError(401, "Not delete successfully")
        }

        return res.ststus(200)
        .json (new ApiResponse(200, {}, "deleted successfully"))
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
    loginUser,
    logOutUser,
    updateUser,
    deleteUser,
    
}