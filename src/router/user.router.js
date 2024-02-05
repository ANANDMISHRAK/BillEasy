import express from "express";
import { deleteUser, logOutUser, loginUser, registerUser, updateUser } from "../controller/user.controller.js";
import { verfyjwt } from "../middleware/verfyjwt.js";

const router= express();

router.route("/register").post( registerUser)

router.route('/login').post(loginUser)

router.route('/logout').get(verfyjwt, logOutUser)

router.route('/update').patch(verfyjwt, updateUser)

router.route('/delete').delete(verfyjwt, deleteUser)




export default router