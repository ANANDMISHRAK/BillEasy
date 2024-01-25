import express from "express"
import cors from "cors"
import userRouter from './router/user.router.js'
const app = express()

app.use(cors({origin:process.env.CORS_ORIGN}))

app.use(express.json({limit:"150kb"}))
app.use(express.urlencoded({extended: true, limit:"200kb"}))
//app.use(express.static())


app.use('/api/v1/users', userRouter)
export {app}