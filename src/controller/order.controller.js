import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandlere.js";
import { Ordcer } from "../models/order.model.js";
import mongoose from "mongoose";


// create order
const createOrder= asyncHandler(async(req, res)=>
{
    try{
         const { amount}= req.body 
         if(!amount)
         {
            throw new ApiError(401, "Unauthorized reques")
         }
         // in DB
         const order = await Ordcer.create(
                                            {
                                                userId: req.user?._id,
                                                amount

                                            }
                                          )
        if(!order)
        {
            throw new ApiError(401, "Not Successfull Order , this item")
        }

        return res.status(200)
        .json(new ApiResponse(200, order, "sucessfully ordered this Item"))
       }
    catch(error)
    {
        if(error)
        {
            res.send(error.message)
        }
    }
})

//  Retrieve a single order by its ID.
const getOrderById = asyncHandler(async(req, res)=>
{
    try{
        const {orderId} = req.params 
        if(!orderId)
        {
            throw new ApiError(401, "orderId is required")
        }
        const order = await Ordcer.findById(orderId)

        if(!order)
        {
            throw new ApiError(401, "Incorrect Order ID")
        }

        return res.status(200)
        .json( new ApiResponse(200, order, "order featchsuccessfully"))
       }
    catch(error)
    {
        if(error instanceof ApiError)
        {
            res.send(error.message)
        }
    }
})

// Update an order's total amount by its ID.
const updateAmount = asyncHandler(async(req, res)=>
{
    try{
         const {orderId}= req.params  
         if(!orderId)
         {
            throw new ApiError(401, "ordere Id must be required")
         }
         const {amount}= req.body 
         if(!amount)
         {
            throw new ApiError(401,"amount is required")
         }
         // find order from DB
         const order= await Ordcer.findById(orderId)
         if(!order)
         {
            throw new ApiError(401, "This order does not exist")
         }
         // check user is Autorized to do
         if(order.userId.toString() !== req.user?._id.toString())
         {
            throw new ApiError(401, "Unauthorized user")
         }

         // update
         const updetedAmont= await Ordcer.findByIdAndUpdate( 
                                                             orderId,
                                                             {
                                                                $set: {
                                                                          amount
                                                                      }
                                                             },
                                                             {
                                                                new: true
                                                             }
                                                           )
                                                           
        if(!updetedAmont)
        {
            throw new ApiError(401, "not upded Amount successfully")
        }

        return res.status(200)
        .json (new ApiResponse(200, updetedAmont, "Amount updated successfully"))
       }
    catch(error)
    {
        res.send(error.message)
    }
})

// Delete an order by its ID

const deleteOrder = asyncHandler(async(req, res)=>{
    try{
        const {orderId}= req.params  
        if(!orderId)
        {
           throw new ApiError(401, "ordere Id must be required")
        }

        const order= await Ordcer.findById(orderId)
         if(!order)
         {
            throw new ApiError(401, "This order does not exist")
         }
        
         if(order.userId.toString() !== req.user?._id.toString())
         {
            throw new ApiError(401, "Unauthorized user")
         }

         // deletd order
         await Ordcer.findByIdAndDelete(orderId)

         return res.status(200)
         .json(200, {}, "Order successfully delete")
       }
    catch(error)
    {
        if(error instanceof ApiError)
        {
            res.send(error.message)
        }
    }
})

// Task -4 Retrieve all orders for a specific user.
const allOrderOfUser = asyncHandler(async(req, res)=>{
    try{
          const userId= req.user?._id
         // console.log(userId, req.user?._id)
          if(!userId)
          {
            throw new ApiError(401, "user id must be required")
          }
          
          // mongo pipline
          const allorder= await Ordcer.aggregate([
                                                    // stage one findd all order of user
                                                    {
                                                      $match: {userId : new mongoose.Types.ObjectId(req.user?._id)}
                                                    },
                                                    // sort order by create date
                                                    {
                                                        $sort:{createdAt:-1 }
                                                    }
                                                  ])

    return res.status(200)
    .json( new ApiResponse(200, allorder, "user order featch success fully"))
       }
    catch(error)
    {
        if(error instanceof ApiError)
        {
            res.send(error.message)
        }
    }
})


//Task - 05 Create a route to retrieve the total revenue generated from all orders. Note - Use the native mongoose $sum aggregation function to calculate the total revenue. 

const totalRevenue = asyncHandler(async(req, res)=>{
    try{
         const revenue = await Ordcer.aggregate([{
                                                   $group: {
                                                             _id:null,
                                                             TotalRevenue:{ $sum: "$amount"}
                                                           }  
                                               }])


         return res.status(200)
         .json(new ApiResponse(200, revenue, "featch Total revenue"))
       }
    catch(error)
    {
        res.send(error.message)
    }
})

export {
         createOrder,
         getOrderById,
         updateAmount,
         deleteOrder,
         allOrderOfUser,
         totalRevenue
       }