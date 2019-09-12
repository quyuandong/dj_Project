const express = require('express')
const router = express.Router()
const passport = require('passport')

const Comment = require('../../model/Comment')

//添加评议接口
router.post('/add',passport.authenticate("jwt", { session: false }),(req, res) => {
    let commentsFileds = {}
    commentsFileds.description = req.body.description
    commentsFileds.content = req.body.content
    new Comment(commentsFileds).save().then(() => {
        res.json({
            code: 1,
            msg: '添加成功'
        })
    })
})

//获取评议列表接口
// router.get('/list',passport.authenticate("jwt", { session: false }),(req,res)=>{
//     Comment.find().then(comment=>{
//         if(!comment){
//             return res.status(404).json({
//                 code:0,
//                 msg:'没有内容'
//             })
//         }
//         res.json(comment)
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
   
    Comment.find(attrs).skip(slipNum).limit(pageSize).sort(sort).then(newss=>{
        if(!newss){
            return res.status(404).json("没有任何内容")
        }
        Comment.count(attrs).then((data) => {
            res.json({
                count:data,
                news:newss
            })
        })
    })
})

//修改评议接口
router.post('/edit/:id',passport.authenticate("jwt", { session: false }),(req,res)=>{
    let commentsFileds = {}
    commentsFileds.description = req.body.description
    commentsFileds.content = req.body.content
    Comment.findOneAndUpdate({_id:req.params.id},{$set:commentsFileds},{new:true}).then(()=>{
        res.json({
            code:1,
            msg:'更新成功'
        })
    })
})

//查找评议接口
router.get('/find/:id',passport.authenticate("jwt", { session: false }),(req,res)=>{
    Comment.findOne({_id:req.params.id}).then(data=>{
        if(data){
            res.json(data)
        }
    })
})

module.exports = router