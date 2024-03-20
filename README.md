后端启动：property_management_system目录下npm run serve。
前端启动：back_end目录下nodemon app.js。
本地数据库连接在app.js文件中。
const db=mysql.createConnection({
    host:"127.0.0.1",
    user:"root",
    password:"123456",
    database:"property_management"
})
