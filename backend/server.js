import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinry from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRouter.js'
import blogRouter from './routes/blogRouter.js'
import paymentRouter from './routes/paymentRoute.js'
import AiRoute from './routes/AiRoute.js'


//app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinry()

//midlewares
app.use(express.json())
app.use(cors())

//api endpoint
app.use('/api/admin',adminRouter)
app.use('/api/doctor',doctorRouter)
app.use('/api/user',userRouter)
app.use("/api/blog", blogRouter);
app.use('/uploads', express.static('uploads'));
app.use('/api/payment', paymentRouter);
app.use('/api/AI',AiRoute)

//localhost:4000/api/admin/add-doctor

app.get('/',(req,res)=>{
    res.send('API working fine')
})

app.listen(port,()=> console.log("Server Started",port))