import express from "express";
import { verfyjwt } from "../middleware/verfyjwt.js";
import {
    allOrderOfUser,
        createOrder,
        deleteOrder,
        getOrderById,
        totalRevenue,
        updateAmount,

        } from "../controller/order.controller.js";

const router= express();

//create order
router.route('/create-order').post(verfyjwt, createOrder)

//get order by id
router.route('/order-by-id/:orderId').get(getOrderById)

// update Amount
router.route('/update-amount/:orderId').patch(verfyjwt, updateAmount)


//delete order 
router.route('/delete-order/:orderId').delete(verfyjwt, deleteOrder)

// retrive all order of a user
router.route('/orders-user').get(verfyjwt,  allOrderOfUser)


router.route('/revenue').get(totalRevenue)



export default router