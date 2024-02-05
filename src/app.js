import express from "express"
import cors from "cors"
import cookieParser from 'cookie-parser'
import userRouter from './router/user.router.js'
import orderRouter from './router/ordet.route.js'


const app = express()

app.use(cors({origin:process.env.CORS_ORIGN}))

app.use(express.json({limit:"150kb"}))
app.use(express.urlencoded({extended: true, limit:"200kb"}))
//app.use(express.static())

app.use(cookieParser());

app.use('/api/v1/users', userRouter)
app.use('/api/v1/order', orderRouter)


export {app}