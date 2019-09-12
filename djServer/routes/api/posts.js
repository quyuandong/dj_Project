// 党员互动数据api接口
const express = require('express')
const Post = require('../../model/Post')
const router = express.Router()
const passport = require('passport')
// 检测能否连接成功
router.get('/',(req,res)=>{
    res.json('你好')
})

// 添加互动帖(创建集合用)
router.post('/add',passport.authenticate("jwt", { session: false }),(req,res)=>{
    const username = req.body.username
    const content = req.body.content
    const follow = req.body.follow
    let postsMsg = {
        username,
        content,
        follow
    }
    new Post(postsMsg).save()
    .then(post=>res.json({
        code:1,
        message:'添加帖子成功'
    }))
    .catch(err=>res.status(404).json({
        code:0,
        message:'帖子添加失败'
    }))
})

// 获取帖子列表
// router.get('/list',passport.authenticate("jwt", { session: false }),(req,res)=>{
//     Post.find({}).then(posts=>res.json(posts))
//     .catch(err=>{
//         res.status(404).json(err)
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
   
    Post.find(attrs).skip(slipNum).limit(pageSize).sort(sort).then(newss=>{
        if(!newss){
            return res.status(404).json("没有任何内容")
        }
        Post.count(attrs).then((data) => {
            res.json({
                count:data,
                news:newss
            })
        })
    })
})

module.exports = router