//引入express和router
const express=require("express")
const router=express.Router()
const mysql=require("mysql")
//连接数据库
const db=mysql.createConnection({
    host:"127.0.0.1",
    user:"root",
    password:"123456",
    database:"property_management"
})


//最简单的查询语句
// db.query("select * from manager",(err,res)=>{
//     if(err) return console.log(err.message)
//     console.log(res)
// })

//自定义router的get和post路由
router.get("/get",(req,res)=>{
    res.send({
        status:0, //响应状态码，0代表成功，1代表失败
        msg:"请求成功", //响应内容
        body:req.query //响应主体
    })
})
//post接口范例
router.post("/post",(req,res)=>{
    res.send({
        status:0, //响应状态码，0代表成功，1代表失败
        msg:"请求成功", //响应内容
        body:req.query //响应主体
    })
})

//获取所有管理员账户信息接口
router.get("/getManagers",(req,res)=>{
    db.query("select * from manager",(err,sql_data)=>{
        if(err) return console.log(err.message)
        //响应内容
        res.send({
            status:0, //响应状态码，0代表成功，1代表失败
            msg:"请求成功", //响应内容
            body:sql_data, //响应主体
        })
    })
})

//获取所有楼栋信息接口
router.get('/getBuildings',(req,res)=>{
    db.query('select * from building',(err,sql_data)=>{
        if(err) return console.log(err.message)
        //响应数据处理
        var buildings_id=sql_data.map(( item, index, arr)=>{
            return item.building_id;
        } )
        //响应内容
        res.send({
            status:0, //响应状态码，0代表成功，1代表失败
            msg:"请求成功", //响应内容
            body:buildings_id, //响应主体
        })
    })
})

//获取所有房屋信息接口
router.get("/getHouses",(req,res)=>{
    db.query("select house_id,building_id,floor,h.user_id,user_name,is_occupied from house h join resident r on h.user_id=r.user_id union select house_id,building_id,floor,user_id,null as user_name,is_occupied from house where is_occupied=0",(err,sql_data)=>{
        if(err) return console.log(err.message)
        //修改是否居住数据的返回值
        // var res_data=sql_data.map(( item, index, arr)=>{
        //     item.is_occupied=item.is_occupied ? "是":"否";
        //     return item;
        // } )
        //响应内容
        res.send({
            status:0, //响应状态码，0代表成功，1代表失败
            msg:"请求成功", //响应内容
            body:sql_data, //响应主体
        })
    })
})

//获取某楼栋房屋信息接口
router.post("/getBuildingHouses",(req,res)=>{
    let building_id=1
    if(req.body.building_id){
        building_id=req.body.building_id
    }
    db.query(`select house_id,building_id,floor,h.user_id,user_name,is_occupied from house h join resident r on h.user_id=r.user_id and h.building_id=${building_id} union select house_id,building_id,floor,user_id,null as user_name,is_occupied from house where is_occupied=0 and building_id=${building_id}`,(err,sql_data)=>{
        if(err) return console.log(err.message)
        //修改是否居住数据的返回值
        // var res_data=sql_data.map(( item, index, arr)=>{
        //     item.is_occupied=item.is_occupied ? "是":"否";
        //     return item;
        // } )
        //响应内容
        res.send({
            status:0, //响应状态码，0代表成功，1代表失败
            msg:"请求成功", //响应内容
            body:sql_data, //响应主体
        })
    })
})

//获取所有用户id
router.get("/getResidentsId",(req,res)=>{
    db.query("select user_id from resident",(err,sql_data)=>{
        if(err) return console.log(err.message)
        //修改是否居住数据的返回值
        var res_data=sql_data.map(( item, index, arr)=>{
            return item.user_id
        } )
        //响应内容
        res.send({
            status:0, //响应状态码，0代表成功，1代表失败
            msg:"请求成功", //响应内容
            body:res_data, //响应主体
        })
    })
})

//获取所有用户信息
router.get("/getResidents",(req,res)=>{
    db.query("select * from resident",(err,sql_data)=>{
        if(err) return console.log(err.message)
        //响应内容
        res.send({
            status:0, //响应状态码，0代表成功，1代表失败
            msg:"请求成功", //响应内容
            body:sql_data, //响应主体
        })
    })
})

//获取所有用户信息不包括密码
router.get("/getResidentsInfo",(req,res)=>{
    db.query("select user_id,user_name,phone_number from resident",(err,sql_data)=>{
        if(err) return console.log(err.message)
        //响应内容
        res.send({
            status:0, //响应状态码，0代表成功，1代表失败
            msg:"请求成功", //响应内容
            body:sql_data, //响应主体
        })
    })
})

//修改屋主数据
router.post("/changeHouseOwner",(req,res)=>{
    console.log(req.body)
    console.log("有人访问接口")
    let house_id=req.body.house_id
    let user_id=req.body.user_id
    let is_occupied=req.body.is_occupied
    //当房屋信息修改后，没人住该房子时
    console.log(house_id,user_id,is_occupied)
    if(!is_occupied){
        db.query(`update house set user_id=null,is_occupied=0 where house_id=?`,[house_id],(err,sql_data)=>{
            if(err) return console.log(err.message)
            //响应内容
            res.send({
                status:0, //响应状态码，0代表成功，1代表失败
                msg:"请求成功", //响应内容
                body:"房屋数据修改成功", //响应主体
            })
        })
    }
    else{
        db.query(`update house set user_id=?,is_occupied=? where house_id=?`,[user_id,is_occupied,house_id],(err,sql_data)=>{
            if(err) return console.log(err.message)
            //响应内容
            res.send({
                status:0, //响应状态码，0代表成功，1代表失败
                msg:"请求成功", //响应内容
                body:"房屋数据修改成功", //响应主体
            })
        })
    }
})

//管理员登录
router.post("/managerLogin",(req,res)=>{
    let user_id=req.body.user_id
    let password=req.body.password
    db.query("select user_id from manager where user_id=? and password=?",[user_id,password],(err,sql_data)=>{
        if(err) return console.log(err.message)
        //响应内容
        if(sql_data.length===0){
            return res.send({
                status:1, //响应状态码，0代表成功，1代表失败
                msg:"请求失败，未找到该用户", //响应内容
            })
        }
        res.send({
            status:0, //响应状态码，0代表成功，1代表失败
            msg:"请求成功", //响应内容
        })
    })
})

//获取所有报修单信息
router.get("/getRepairForms",(req,res)=>{
    db.query("select * from repair",(err,sql_data)=>{
        if(err) return console.log(err.message)
        //响应内容
        res.send({
            status:0, //响应状态码，0代表成功，1代表失败
            msg:"请求成功", //响应内容
            body:sql_data, //响应主体
        })
    })
})

//获取所有报修单信息以及报修的用户信息
router.get("/getRepairFormsAndResidents",(req,res)=>{
    db.query("select repair_form_id,type,content,progress,re.user_id,user_name,phone_number from repair as rp, resident as re where rp.user_id=re.user_id",(err,sql_data)=>{
        if(err) return console.log(err.message)
        //响应内容
        res.send({
            status:0, //响应状态码，0代表成功，1代表失败
            msg:"请求成功", //响应内容
            body:sql_data, //响应主体
        })
    })
})

//获取所有投诉信息以及投诉的用户信息
router.get("/getComplaintAndResidents",(req,res)=>{
    db.query("select complaint_id,content,is_checked,c.user_id,user_name,phone_number  from complaint as c,resident as r where c.user_id=r.user_id",(err,sql_data)=>{
        if(err) return console.log(err.message)
        //响应内容
        res.send({
            status:0, //响应状态码，0代表成功，1代表失败
            msg:"请求成功", //响应内容
            body:sql_data, //响应主体
        })
    })
})

//获取所有通知公告内容
router.get("/getAnnouncements",(req,res)=>{
    db.query("select * from announcement;",(err,sql_data)=>{
        if(err) return console.log(err.message)
        //响应内容
        res.send({
            status:0, //响应状态码，0代表成功，1代表失败
            msg:"请求成功", //响应内容
            body:sql_data, //响应主体
        })
    })
})

//获取缴费单及其已缴费人数信息
router.get("/getPaymentsInfo",(req,res)=>{
    db.query("select table2.payment_id,content,sum,have_paid,payments from (select table1.payment_id,payments,content,sum from  (select payment_id,count(1) as payments from payment_list group by payment_id) as table1 inner join payment on table1.payment_id=payment.payment_id) as table2 left join (select payment_id,count(case when is_paid=1 then 1 else null end) as have_paid from payment_list group by payment_id) as table3 on table2.payment_id=table3.payment_id;",(err,sql_data)=>{
        if(err) return console.log(err.message)
        //响应内容
        res.send({
            status:0, //响应状态码，0代表成功，1代表失败
            msg:"请求成功", //响应内容
            body:sql_data, //响应主体
        })
    })
})

//新增楼栋接口
router.post("/addBuilding",(req,res)=>{
    let building_id=1
    if(req.body.building_id){
        building_id=req.body.building_id
    }
    else{
        return res.send({
            status:1, //响应状态码，0代表成功，1代表失败
            msg:"未携带楼栋id数据", //响应内容
        })
    }
    db.query("insert into building (building_id) values (?)",[building_id],(err,sql_data)=>{
        if(err) return console.log(err.message)
        res.send({
            status:0, //响应状态码，0代表成功，1代表失败
            msg:"添加楼栋成功", //响应内容
        })
    })
})

//删除楼栋接口
router.post("/deleteBuilding",(req,res)=>{
    let building_id=1
    if(req.body.building_id){
        building_id=req.body.building_id
    }
    else{
        return res.send({
            status:1, //响应状态码，0代表成功，1代表失败
            msg:"未携带楼栋id数据", //响应内容
        })
    }
    db.query("delete from building where building_id=?",[building_id],(err,sql_data)=>{
        if(err) return console.log(err.message)
        res.send({
            status:0, //响应状态码，0代表成功，1代表失败
            msg:"删除楼栋成功", //响应内容
        })
    })
})

//修改楼栋接口
router.post("/changeBuildingId",(req,res)=>{
    let old_building_id=1
    let new_building_id=1
    if((req.body.old_building_id)&&(req.body.new_building_id)){
        old_building_id=req.body.old_building_id
        new_building_id=req.body.new_building_id
    }
    else{
        return res.send({
            status:1, //响应状态码，0代表成功，1代表失败
            msg:"未携带修改前后楼栋id数据", //响应内容
        })
    }
    db.query("update building set building_id=? where building_id=?",[new_building_id,old_building_id],(err,sql_data)=>{
        if(err) return console.log(err.message)
        if(sql_data.affectedRows==0){
            return res.send({
                status:1, //响应状态码，0代表成功，1代表失败
                msg:"修改信息输入有误，请重新检查", //响应内容
            })
        }
        res.send({
            status:0, //响应状态码，0代表成功，1代表失败
            msg:"修改楼栋成功", //响应内容
        })
    })
})


//新增房屋接口
router.post("/addHouse",(req,res)=>{
    let house_id=null
    let building_id=null
    let floor=null
    if((req.body.house_id)&&(req.body.building_id)&&(req.body.floor)){
        house_id=req.body.house_id
        building_id=req.body.building_id
        floor=req.body.floor
    }
    else{
        return res.send({
            status:1, //响应状态码，0代表成功，1代表失败
            msg:"未携带完整房屋数据", //响应内容
        })
    }
    db.query(`insert into house (house_id,building_id,floor) values ('${house_id}',${building_id},${floor})`,(err,sql_data)=>{
        if(err) return console.log(err.message)
        if(sql_data.affectedRows==0){
            return res.send({
                status:1, //响应状态码，0代表成功，1代表失败
                msg:"新增房屋信息输入有误，请重新检查", //响应内容
            })
        }
        res.send({
            status:0, //响应状态码，0代表成功，1代表失败
            msg:"新增房屋成功", //响应内容
        })
    })
})

//删除房屋接口
router.post("/deleteHouse",(req,res)=>{
    let house_id=null
    if(req.body.house_id){
        house_id=req.body.house_id
    }
    else{
        return res.send({
            status:1, //响应状态码，0代表成功，1代表失败
            msg:"未输入房屋id数据", //响应内容
        })
    }
    db.query(`delete from house where house_id='${house_id}'`,(err,sql_data)=>{
        if(err) return console.log(err.message)
        if(sql_data.affectedRows==0){
            return res.send({
                status:1, //响应状态码，0代表成功，1代表失败
                msg:"删除房屋号输入有误，请重新检查", //响应内容
            })
        }
        res.send({
            status:0, //响应状态码，0代表成功，1代表失败
            msg:"删除房屋成功", //响应内容
        })
    })
})

//新增管理员接口
router.post("/addManager",(req,res)=>{
    let user_id=null
    let user_name=null
    let password=null
    if((req.body.user_id)&&(req.body.user_name)&&(req.body.password)){
        user_id=req.body.user_id
        user_name=req.body.user_name
        password=req.body.password
    }
    else{
        return res.send({
            status:1, //响应状态码，0代表成功，1代表失败
            msg:"请检查新建管理员数据", //响应内容
        })
    }
    db.query(`insert into manager (user_id,user_name,password) values ('${user_id}','${user_name}','${password}')`,(err,sql_data)=>{
        if(err) return console.log(err.message)
        if(sql_data.affectedRows==0){
            return res.send({
                status:1, //响应状态码，0代表成功，1代表失败
                msg:"新增管理员输入有误，请重新检查", //响应内容
            })
        }
        res.send({
            status:0, //响应状态码，0代表成功，1代表失败
            msg:"新增管理员成功", //响应内容
        })
    })
})
//删除管理员接口
router.post("/deleteManager",(req,res)=>{
    let user_id=null
    if(req.body.user_id){
        user_id=req.body.user_id
    }
    else{
        return res.send({
            status:1, //响应状态码，0代表成功，1代表失败
            msg:"未输入管理员id数据", //响应内容
        })
    }
    db.query(`delete from manager where user_id='${user_id}'`,(err,sql_data)=>{
        if(err) return console.log(err.message)
        if(sql_data.affectedRows==0){
            return res.send({
                status:1, //响应状态码，0代表成功，1代表失败
                msg:"删除管理员id有误，请重新检查", //响应内容
            })
        }
        res.send({
            status:0, //响应状态码，0代表成功，1代表失败
            msg:"删除管理员成功", //响应内容
        })
    })
})
//修改管理员接口
router.post("/changeManager",(req,res)=>{
    let old_user_id=null
    let new_user_id=null
    let user_name=null
    let password=null
    if((req.body.old_user_id)&&(req.body.new_user_id)&&(req.body.user_name)&&(req.body.password)){
        old_user_id=req.body.old_user_id
        new_user_id=req.body.new_user_id
        user_name=req.body.user_name
        password=req.body.password
    }
    else{
        return res.send({
            status:1, //响应状态码，0代表成功，1代表失败
            msg:"未携带完整修改管理员数据", //响应内容
        })
    }
    db.query(`update manager set user_id='${new_user_id}',user_name='${user_name}',password='${password}' where user_id='${old_user_id}'`,(err,sql_data)=>{
        if(err) return console.log(err.message)
        if(sql_data.affectedRows==0){
            return res.send({
                status:1, //响应状态码，0代表成功，1代表失败
                msg:"修改管理员信息输入有误，请重新检查", //响应内容
            })
        }
        res.send({
            status:0, //响应状态码，0代表成功，1代表失败
            msg:"修改管理员成功", //响应内容
        })
    })
})
//新增业主接口
router.post("/addResident",(req,res)=>{
    let user_id=null
    let user_name=null
    let password=null
    let phone_number=null
    if((req.body.user_id)&&(req.body.user_name)&&(req.body.password)&&(req.body.phone_number)){
        user_id=req.body.user_id
        user_name=req.body.user_name
        password=req.body.password
        phone_number=req.body.phone_number
    }
    else{
        return res.send({
            status:1, //响应状态码，0代表成功，1代表失败
            msg:"请检查新建业主数据", //响应内容
        })
    }
    db.query(`insert into resident (user_id,user_name,password,phone_number) values ('${user_id}','${user_name}','${password}','${phone_number}')`,(err,sql_data)=>{
        if(err) return console.log(err.message)
        if(sql_data.affectedRows==0){
            return res.send({
                status:1, //响应状态码，0代表成功，1代表失败
                msg:"新增业主输入有误，请重新检查", //响应内容
            })
        }
        res.send({
            status:0, //响应状态码，0代表成功，1代表失败
            msg:"新增业主成功", //响应内容
        })
    })
})
//删除业主接口
router.post("/deleteResident",(req,res)=>{
    let user_id=null
    if(req.body.user_id){
        user_id=req.body.user_id
    }
    else{
        return res.send({
            status:1, //响应状态码，0代表成功，1代表失败
            msg:"未输入业主id数据", //响应内容
        })
    }
    db.query(`delete from resident where user_id='${user_id}'`,(err,sql_data)=>{
        if(err) return console.log(err.message)
        if(sql_data.affectedRows==0){
            return res.send({
                status:1, //响应状态码，0代表成功，1代表失败
                msg:"删除业主id有误，请重新检查", //响应内容
            })
        }
        res.send({
            status:0, //响应状态码，0代表成功，1代表失败
            msg:"删除业主成功", //响应内容
        })
    })
})
//修改业主接口
router.post("/changeResident",(req,res)=>{
    let old_user_id=null
    let new_user_id=null
    let user_name=null
    let password=null
    let phone_number=null
    if((req.body.old_user_id)&&(req.body.new_user_id)&&(req.body.user_name)&&(req.body.password)&&(req.body.phone_number)){
        old_user_id=req.body.old_user_id
        new_user_id=req.body.new_user_id
        user_name=req.body.user_name
        password=req.body.password
        phone_number=req.body.phone_number
    }
    else{
        return res.send({
            status:1, //响应状态码，0代表成功，1代表失败
            msg:"未携带完整修改业主数据", //响应内容
        })
    }
    db.query(`update resident set user_id='${new_user_id}',user_name='${user_name}',password='${password}',phone_number='${phone_number}' where user_id='${old_user_id}'`,(err,sql_data)=>{
        if(err) return console.log(err.message)
        if(sql_data.affectedRows==0){
            return res.send({
                status:1, //响应状态码，0代表成功，1代表失败
                msg:"修改业主信息输入有误，请重新检查", //响应内容
            })
        }
        res.send({
            status:0, //响应状态码，0代表成功，1代表失败
            msg:"修改业主成功", //响应内容
        })
    })
})
//删除报修单接口
router.post("/deleteRepairForm",(req,res)=>{
    let repair_form_id=null
    if(req.body.repair_form_id){
        repair_form_id=req.body.repair_form_id
    }
    else{
        return res.send({
            status:1, //响应状态码，0代表成功，1代表失败
            msg:"未输入报修单id数据", //响应内容
        })
    }
    db.query(`delete from repair where repair_form_id=${repair_form_id}`,(err,sql_data)=>{
        if(err) return console.log(err.message)
        if(sql_data.affectedRows==0){
            return res.send({
                status:1, //响应状态码，0代表成功，1代表失败
                msg:"删除报修单id有误，请重新检查", //响应内容
            })
        }
        res.send({
            status:0, //响应状态码，0代表成功，1代表失败
            msg:"删除报修单成功", //响应内容
        })
    })
})

//修改报修单接口
router.post("/modifyRepairForm",(req,res)=>{
    let repair_form_id=null
    let progress=null
    if((req.body.repair_form_id)&&(req.body.progress)){
        repair_form_id=req.body.repair_form_id
        progress=req.body.progress
    }
    else{
        return res.send({
            status:1, //响应状态码，0代表成功，1代表失败
            msg:"未携带完整修改报修单数据", //响应内容
        })
    }
    db.query(`update repair set progress=${progress} where repair_form_id=${repair_form_id}`,(err,sql_data)=>{
        if(err) return console.log(err.message)
        if(sql_data.affectedRows==0){
            return res.send({
                status:1, //响应状态码，0代表成功，1代表失败
                msg:"修改报修单数据输入有误，请重新检查", //响应内容
            })
        }
        res.send({
            status:0, //响应状态码，0代表成功，1代表失败
            msg:"修改报修单状态成功", //响应内容
        })
    })
})
//修改投诉接口
router.post("/modifyComplaintForm",(req,res)=>{
    let complaint_id=null
    let is_checked=null
    if((req.body.complaint_id)&&('is_checked' in req.body)){
        complaint_id=req.body.complaint_id
        is_checked=req.body.is_checked
    }
    else{
        return res.send({
            status:1, //响应状态码，0代表成功，1代表失败
            msg:"未携带完整修改投诉数据", //响应内容
        })
    }
    db.query(`update complaint set is_checked=${is_checked}  where complaint_id=${complaint_id}`,(err,sql_data)=>{
        if(err) return console.log(err.message)
        if(sql_data.affectedRows==0){
            return res.send({
                status:1, //响应状态码，0代表成功，1代表失败
                msg:"修改投诉数据输入有误，请重新检查", //响应内容
            })
        }
        res.send({
            status:0, //响应状态码，0代表成功，1代表失败
            msg:"修改投诉状态成功", //响应内容
        })
    })
})
//删除投诉接口
router.post("/deleteComplaint",(req,res)=>{
    let complaint_id=null
    if(req.body.complaint_id){
        complaint_id=req.body.complaint_id
    }
    else{
        return res.send({
            status:1, //响应状态码，0代表成功，1代表失败
            msg:"未输入投诉id数据", //响应内容
        })
    }
    db.query(`delete from complaint where complaint_id=${complaint_id}`,(err,sql_data)=>{
        if(err) return console.log(err.message)
        if(sql_data.affectedRows==0){
            return res.send({
                status:1, //响应状态码，0代表成功，1代表失败
                msg:"删除投诉id有误，请重新检查", //响应内容
            })
        }
        res.send({
            status:0, //响应状态码，0代表成功，1代表失败
            msg:"删除投诉成功", //响应内容
        })
    })
})
//新增公告接口
router.post("/addAnnouncement",(req,res)=>{
    let title=null
    let content=null
    if((req.body.title)&&(req.body.content)){
        title=req.body.title
        content=req.body.content
    }
    else{
        return res.send({
            status:1, //响应状态码，0代表成功，1代表失败
            msg:"请检查新建公告数据", //响应内容
        })
    }
    db.query(`insert into announcement (title,content) values ("${title}","${content}")`,(err,sql_data)=>{
        if(err) return console.log(err.message)
        if(sql_data.affectedRows==0){
            return res.send({
                status:1, //响应状态码，0代表成功，1代表失败
                msg:"新增公告输入有误，请重新检查", //响应内容
            })
        }
        res.send({
            status:0, //响应状态码，0代表成功，1代表失败
            msg:"新增公告成功", //响应内容
        })
    })
})
//删除公告接口
router.post("/deleteAnnouncement",(req,res)=>{
    let announcement_id=null
    if(req.body.announcement_id){
        announcement_id=req.body.announcement_id
    }
    else{
        return res.send({
            status:1, //响应状态码，0代表成功，1代表失败
            msg:"未输入公告id数据", //响应内容
        })
    }
    db.query(`delete from announcement where announcement_id=${announcement_id}`,(err,sql_data)=>{
        if(err) return console.log(err.message)
        if(sql_data.affectedRows==0){
            return res.send({
                status:1, //响应状态码，0代表成功，1代表失败
                msg:"删除公告id有误，请重新检查", //响应内容
            })
        }
        res.send({
            status:0, //响应状态码，0代表成功，1代表失败
            msg:"删除公告成功", //响应内容
        })
    })
})
//新增缴费单接口
router.post("/addPayment",(req,res)=>{
    let content=null
    let sum=null
    let users=null
    if((req.body.content)&&(req.body.sum)&&(req.body.users)){
        content=req.body.content
        sum=req.body.sum
        users=req.body.users
    }
    else{
        return res.send({
            status:1, //响应状态码，0代表成功，1代表失败
            msg:"请检查新增缴费单数据", //响应内容
        })
    }
    db.query(`insert into payment (content,sum) values ("${content}",${sum})`,(err,sql_data)=>{
        if(err) return console.log(err.message)
        if(sql_data.affectedRows==0){
            return res.send({
                status:1, //响应状态码，0代表成功，1代表失败
                msg:"新增缴费单输入有误，请重新检查", //响应内容
            })
        }
        let payment_id=sql_data.insertId
        let mysqlStr=""
        for(let i=0;i<=users.length-1;i++){
            let user_id=users[i]
            if(i==(users.length-1)){
                mysqlStr=mysqlStr.concat(`(${payment_id},'${user_id}',false)`)
                break;
            }
            mysqlStr=mysqlStr.concat(`(${payment_id},'${user_id}',false),`)
        }
        db.query(`insert into payment_list (payment_id,user_id,is_paid) values ${mysqlStr} `,(err,sql_data)=>{
            res.send({
                status:0, //响应状态码，0代表成功，1代表失败
                msg:"新增缴费单成功", //响应内容
                data:sql_data,
            })
        })
        
    })
})
//获取所有业主id和姓名
router.get("/getUserIdsAndNames",(req,res)=>{
    db.query("select user_id,user_name from resident",(err,sql_data)=>{
        if(err) return console.log(err.message)
        //响应内容
        res.send({
            status:0, //响应状态码，0代表成功，1代表失败
            msg:"请求成功", //响应内容
            body:sql_data, //响应主体
        })
    })
})
//删除缴费单接口
router.post("/deletePayment",(req,res)=>{
    let payment_id=null
    if(req.body.payment_id){
        payment_id=req.body.payment_id
    }
    else{
        return res.send({
            status:1, //响应状态码，0代表成功，1代表失败
            msg:"未输入缴费单id数据", //响应内容
        })
    }
    db.query(`delete from payment where payment_id=${payment_id}`,(err,sql_data)=>{
        if(err) return console.log(err.message)
        if(sql_data.affectedRows==0){
            return res.send({
                status:1, //响应状态码，0代表成功，1代表失败
                msg:"删除缴费单id有误，请重新检查", //响应内容
            })
        }
        res.send({
            status:0, //响应状态码，0代表成功，1代表失败
            msg:"删除缴费单成功", //响应内容
        })
    })
})
//获取某缴费单未缴纳业主信息
router.post("/getNotPaidUsers",(req,res)=>{
    let payment_id=null
    if(req.body.payment_id){
        payment_id=req.body.payment_id
    }
    else{
        return res.send({
            status:1, //响应状态码，0代表成功，1代表失败
            msg:"未输入缴费单id数据", //响应内容
        })
    }
    db.query(`select user_name from payment_list,resident where payment_list.user_id=resident.user_id and is_paid=0 and payment_id=${payment_id}`,(err,sql_data)=>{
        if(err) return console.log(err.message)
        if(sql_data.affectedRows==0){
            return res.send({
                status:1, //响应状态码，0代表成功，1代表失败
                msg:"删除缴费单id有误，请重新检查", //响应内容
            })
        }
        res.send({
            status:0, //响应状态码，0代表成功，1代表失败
            msg:"删除缴费单成功", //响应内容
            body:sql_data
        })
    })
})
//获取某缴费单缴纳业主信息
router.post("/getPaidUsers",(req,res)=>{
    let payment_id=null
    if(req.body.payment_id){
        payment_id=req.body.payment_id
    }
    else{
        return res.send({
            status:1, //响应状态码，0代表成功，1代表失败
            msg:"未输入缴费单id数据", //响应内容
        })
    }
    db.query(`select user_name from payment_list,resident where payment_list.user_id=resident.user_id and is_paid=1 and payment_id=${payment_id}`,(err,sql_data)=>{
        if(err) return console.log(err.message)
        if(sql_data.affectedRows==0){
            return res.send({
                status:1, //响应状态码，0代表成功，1代表失败
                msg:"删除缴费单id有误，请重新检查", //响应内容
            })
        }
        res.send({
            status:0, //响应状态码，0代表成功，1代表失败
            msg:"删除缴费单成功", //响应内容
            body:sql_data
        })
    })
})
//获取某id的管理员姓名
router.post("/getManagerName",(req,res)=>{
    let user_id=null
    if(req.body.user_id){
        user_id=req.body.user_id
    }
    else{
        return res.send({
            status:1, //响应状态码，0代表成功，1代表失败
            msg:"未输入用户id数据", //响应内容
        })
    }
    db.query(`select user_name from manager where user_id='${user_id}'`,(err,sql_data)=>{
        if(err) return console.log(err.message)
        if(sql_data.affectedRows==0){
            return res.send({
                status:1, //响应状态码，0代表成功，1代表失败
                msg:"查询用户id有误，请重新检查", //响应内容
            })
        }
        res.send({
            status:0, //响应状态码，0代表成功，1代表失败
            msg:"查询用户成功", //响应内容
            body:sql_data
        })
    })
})

//获取某业主的报修单
router.post("/getUserRepairs",(req,res)=>{
    let user_id=null
    if(req.body.user_id){
        user_id=req.body.user_id
    }
    else{
        return res.send({
            status:1, //响应状态码，0代表成功，1代表失败
            msg:"未输入业主id数据", //响应内容
        })
    }
    db.query(`select * from repair where user_id='${user_id}'`,(err,sql_data)=>{
        if(err) return console.log(err.message)
        if(sql_data.affectedRows==0){
            return res.send({
                status:1, //响应状态码，0代表成功，1代表失败
                msg:"业主id有误，请重新检查", //响应内容
            })
        }
        res.send({
            status:0, //响应状态码，0代表成功，1代表失败
            msg:"查询业主报修单成功", //响应内容
            body:sql_data
        })
    })
})
//获取某业主的信息
router.post("/getResidentInfo",(req,res)=>{
    let user_id=null
    if(req.body.user_id){
        user_id=req.body.user_id
    }
    else{
        return res.send({
            status:1, //响应状态码，0代表成功，1代表失败
            msg:"未输入业主id数据", //响应内容
        })
    }
    db.query(`select user_id,user_name,phone_number from resident where user_id="${user_id}"`,(err,sql_data)=>{
        if(err) return console.log(err.message)
        if(sql_data.affectedRows==0){
            return res.send({
                status:1, //响应状态码，0代表成功，1代表失败
                msg:"业主id有误，请重新检查", //响应内容
            })
        }
        res.send({
            status:0, //响应状态码，0代表成功，1代表失败
            msg:"查询业主信息成功", //响应内容
            body:sql_data
        })
    })
})
//获取某业主的的房屋号信息
router.post("/getHouseOfResident",(req,res)=>{
    let user_id=null
    if(req.body.user_id){
        user_id=req.body.user_id
    }
    else{
        return res.send({
            status:1, //响应状态码，0代表成功，1代表失败
            msg:"未输入业主id数据", //响应内容
        })
    }
    db.query(`select house_id from house where user_id="${user_id}"`,(err,sql_data)=>{
        if(err) return console.log(err.message)
        if(sql_data.affectedRows==0){
            return res.send({
                status:1, //响应状态码，0代表成功，1代表失败
                msg:"业主id有误，请重新检查", //响应内容
            })
        }
        res.send({
            status:0, //响应状态码，0代表成功，1代表失败
            msg:"查询业主房屋成功", //响应内容
            body:sql_data
        })
    })
})
//新增报修单
router.post("/addRepair",(req,res)=>{
    let user_id=null
    let content=null
    let type=null
    if((req.body.user_id)&&(req.body.content)&&('type' in req.body)){
        user_id=req.body.user_id
        content=req.body.content
        type=req.body.type
    }
    else{
        return res.send({
            status:1, //响应状态码，0代表成功，1代表失败
            msg:"未输入完整报修单数据", //响应内容
        })
    }
    db.query(`insert into repair (type,content,progress,user_id) values (${type},'${content}',1,'${user_id}')`,(err,sql_data)=>{
        if(err) return console.log(err.message)
        if(sql_data.affectedRows==0){
            return res.send({
                status:1, //响应状态码，0代表成功，1代表失败
                msg:"报修单数据有误,请重新检查", //响应内容
            })
        }
        res.send({
            status:0, //响应状态码，0代表成功，1代表失败
            msg:"添加报修单成功", //响应内容
        })
    })
})
//获取某业主的投诉
router.post("/getUserComplaints",(req,res)=>{
    let user_id=null
    if(req.body.user_id){
        user_id=req.body.user_id
    }
    else{
        return res.send({
            status:1, //响应状态码，0代表成功，1代表失败
            msg:"未输入业主id数据", //响应内容
        })
    }
    db.query(`select * from complaint where user_id='${user_id}'`,(err,sql_data)=>{
        if(err) return console.log(err.message)
        res.send({
            status:0, //响应状态码，0代表成功，1代表失败
            msg:"查询业主报修单成功", //响应内容
            body:sql_data
        })
    })
})
//新增投诉
router.post("/addComplaint",(req,res)=>{
    let user_id=null
    let content=null
    if((req.body.user_id)&&(req.body.content)){
        user_id=req.body.user_id
        content=req.body.content
    }
    else{
        return res.send({
            status:1, //响应状态码，0代表成功，1代表失败
            msg:"未输入完整投诉数据", //响应内容
        })
    }
    db.query(`insert into complaint (content,is_checked,user_id) values ('${content}',0,'${user_id}')`,(err,sql_data)=>{
        if(err) return console.log(err.message)
        if(sql_data.affectedRows==0){
            return res.send({
                status:1, //响应状态码，0代表成功，1代表失败
                msg:"有误，请重新检查", //响应内容
            })
        }
        if(sql_data.affectedRows==0){
            return res.send({
                status:1, //响应状态码，0代表成功，1代表失败
                msg:"投诉数据有误,请重新检查", //响应内容
            })
        }
        res.send({
            status:0, //响应状态码，0代表成功，1代表失败
            msg:"添加投诉成功", //响应内容
        })
    })
})
//获取某业主的缴费单
router.post("/getUserPayments",(req,res)=>{
    let user_id=null
    if(req.body.user_id){
        user_id=req.body.user_id
    }
    else{
        return res.send({
            status:1, //响应状态码，0代表成功，1代表失败
            msg:"未输入业主id数据", //响应内容
        })
    }
    db.query(`select * from payment_list as pl,payment as p where pl.payment_id=p.payment_id and user_id="${user_id}"`,(err,sql_data)=>{
        if(err) return console.log(err.message)
        //修改是否居住数据的返回值
        var res_data=sql_data.map(( item, index, arr)=>{
            item.sum=Number(item.sum)
            return item;
        } )
        res.send({
            status:0, //响应状态码，0代表成功，1代表失败
            msg:"查询业主缴费单成功", //响应内容
            body:res_data
        })
    })
})
//修改缴费单状态
router.post("/payPayment",(req,res)=>{
    let user_id=null
    let payment_id=null
    if(('user_id' in req.body)&&('payment_id' in req.body)){
        user_id=req.body.user_id
        payment_id=req.body.payment_id
    }
    else{
        return res.send({
            status:1, //响应状态码，0代表成功，1代表失败
            msg:"未输入完整缴费单数据", //响应内容
        })
    }
    db.query(`update payment_list set is_paid=1 where payment_id=${payment_id} and user_id="${user_id}"`,(err,sql_data)=>{
        if(err) return console.log(err.message)
        if(sql_data.affectedRows==0){
            return res.send({
                status:1, //响应状态码，0代表成功，1代表失败
                msg:"缴费有误，请重新检查", //响应内容
            })
        }
        res.send({
            status:0, //响应状态码，0代表成功，1代表失败
            msg:"成功", //响应内容
        })
    })
})
//获取某用户个人信息及住房信息
router.post("/getResidentPersonalInfo",(req,res)=>{
    let user_id=null
    if('user_id' in req.body){
        user_id=req.body.user_id
    }
    else{
        return res.send({
            status:1, //响应状态码，0代表成功，1代表失败
            msg:"未输入完整用户id数据", //响应内容
        })
    }
    db.query(`select r.user_id,password,user_name,phone_number,house_id,building_id,floor,is_occupied from resident as r,house as h where r.user_id=h.user_id and r.user_id='${user_id}' union select user_id,password,user_name,phone_number,null as house_id,null as building_id,null as floor,null as is_occupied from resident where user_id='${user_id}'`,(err,sql_data)=>{
        if(err) return console.log(err.message)
        res.send({
            status:0, //响应状态码，0代表成功，1代表失败
            msg:"成功", //响应消息
            body:sql_data[0],//响应数据
        })
    })
})
//业主登录
router.post("/residentLogin",(req,res)=>{
    let user_id=null
    let password=null
    if(('user_id' in req.body)&&('password' in req.body)){
        user_id=req.body.user_id
        password=req.body.password
    }
    else{
        return res.send({
            status:1, //响应状态码，0代表成功，1代表失败
            msg:"未输入业主登录数据", //响应内容
        })
    }
    db.query("select user_id,user_name from resident where user_id=? and password=?",[user_id,password],(err,sql_data)=>{
        if(err) return console.log(err.message)
        //响应内容
        if(sql_data.length===0){
            return res.send({
                status:1, //响应状态码，0代表成功，1代表失败
                msg:"请求失败，未找到该用户", //响应内容
            })
        }
        res.send({
            status:0, //响应状态码，0代表成功，1代表失败
            msg:"登录成功", //响应内容
            body:sql_data
        })
    })
})
//导出router
module.exports=router