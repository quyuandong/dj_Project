const express = require("express")
const Summary = require("../../model/Summary")
const passport = require("passport")  //验证token

const router = express.Router();

// 如果没有带token去访问 默认返回Unauthorized
// 带上token去访问  

// 获取所有的汇报列表 
// router.get("/list", passport.authenticate("jwt",{session:false}),(req,res)=>{
//     Summary.find().then(summarys=>{
//         if(!summarys){
//             return res.status(404).json({
//                 code:0,
//                 msg:"查找失败"
//             })
//         }
//         res.json(summarys)
//     })
// })

// 获取所有的新闻数据
router.get("/list",passport.authenticate("jwt", { session: false }),(req,res)=>{

    let attr = req.query.title;
    let currentPage = parseInt(req.query.currentPage ) || 1;
    let pageSize = parseInt(req.query.pageSize)|| 5;
    let slipNum=(currentPage-1)*pageSize;
    let sort_attr = req.query.sort_attr || "";
    let sort_value = req.query.sort_value || "";

    let attrs = {}
    if(attr){
        attrs.title = new RegExp(attr)
    }

    let sort = {}
    if(sort_attr){
        sort = {[sort_attr]:sort_value};
    }
   
    Summary.find(attrs).skip(slipNum).limit(pageSize).sort(sort).then(newss=>{
        if(!newss){
            return res.status(404).json("没有任何内容")
        }
        Summary.count(attrs).then((data) => {
            res.json({
                count:data,
                news:newss
            })
        })
    })
})


//添加汇报
router.post("/add", passport.authenticate("jwt", { session: false }), (req, res) => {
    const newsummary = {}
    newsummary.username = req.body.username
    newsummary.status = req.body.status
    newsummary.reason = req.body.reason

    new Summary(newsummary).save().then(summary => {
        // res.json(report)
        res.json({
            code:1,
            msg:"添加成功"
        })
    })
})


module.exports = router
