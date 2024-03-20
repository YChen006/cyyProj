//引入express
const express=require("express")
//创建web服务器
const app=express()

//导入cors
const cors=require("cors")
app.use(cors())

//挂载json解析中间件
app.use(express.json())

//导入路由模块
const userRouter=require("./userApi")
//注册路由模块
app.use("/api",userRouter)

app.use((err,req,res,next)=>{
    console.log(err.message)
    res.send("ERROR:"+err.message)
})

//启动web服务器
app.listen(80,()=>{
    console.log("express running at http://127.0.0.1")
})