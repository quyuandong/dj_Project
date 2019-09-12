const express = require('express')
const Focus = require('../../model/Focus')
// const multer = require("multer")
const fs = require('fs')
const path = require('path')
const passport = require('passport')
const router = express.Router()
const formidable = require('formidable')

// // 使用硬盘存储模式设置存放接收到的文件的路径以及文件名
// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         // 接收到文件后输出的保存路径（若不存在则需要创建）
//         cb(null, 'public/upload/focus');
//     },
//     filename: function (req, file, cb) {
//         var fileFormat = (file.originalname).split(".")
//         // 将保存文件名设置为 时间戳 + 文件原始名，比如 151342376785-123.jpg
//         cb(null, Date.now() + "-" + fileFormat[fileFormat.length - 1]);
//     }
// });
// //加载配置
// var upload = multer({
//     storage: storage
// });


//  获取轮播图列表数据接口
router.get('/list', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Focus.find({}).then(ref => {
        res.json(ref)
    })
})


// 添加轮播图数据接口
router.post('/add', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    var form = new formidable.IncomingForm()
    form.encoding = 'utf-8' // 编码
    form.keepExtensions = true // 保留扩展名
    form.uploadDir = path.join(__dirname, '../../public/upload/focus/') //文件存储路径 最后要注意加 '/' 否则会被存在public下
    form.parse(req, (err, fields, files) => {
        if (err) return next(err)
        let sort = fields.sort
        let status = fields.status
        let title = fields.title.trim()
        let url = fields.url
        let oldPath = files.fileList.path //获取文件路径 ~/public/images/<随机生成的文件名>.<扩展名>
        let imgname = files.fileList.name //前台上传时的文件名 也就是文件原本的名字
        let slideImgname = imgname.replace(/[^.]+/, Date.now()) //把扩展名前的文件名给替换掉
        let newPath = path.join(path.dirname(oldPath), slideImgname)
        let picpath = `http://127.0.0.1:3000//upload/focus/${slideImgname}`
        console.log(picpath)
        fs.rename(oldPath, newPath, (err) => {
            if (err) return next(err)
            const newSlide = new Focus({
                title: title,
                sort: sort,
                status: status,
                pic: picpath,
                url: url
            })
            newSlide.save().then(foc => res.json({
                code: 1,
                msg: "添加成功"
            })).catch(err => [
                res.json(err)
            ])
        })
    })
})

// 确认编辑轮播图接口
router.post('/edit', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    var form = new formidable.IncomingForm()
    form.encoding = 'utf-8' // 编码
    form.keepExtensions = true // 保留扩展名
    form.uploadDir = path.join(__dirname, '../../public/upload/focus/') //文件存储路径 最后要注意加 '/' 否则会被存在public
    form.parse(req, (err, fields, files) => {
        if (err) return next(err)
        // form表单数据
        let sort = fields.sort
        let status = fields.status
        let title = fields.title
        console.log(title)
        let url = fields.url
        let id = fields.id
        // let pic = fields.pic
        let oldPath = files.file.path //获取文件路径 ~/public/images/<随机生成的文件名>.<扩展名>
        let imgname = files.file.name //前台上传时的文件名 也就是文件原本的名字
        let slideImgname = imgname.replace(/[^.]+/, Date.now()) //把扩展名前的文件名给替换掉
        let newPath = path.join(path.dirname(oldPath), slideImgname) //文件路径
        let picpath = `http://127.0.0.1:3000//upload/focus/${slideImgname}`
        fs.rename(oldPath, newPath, (err) => {
            if (err) return next(err)
            Focus.updateOne({
                _id: id
            }, {
                title: title,
                sort: sort,
                status: status,
                pic: picpath,
                url: url
            }).then(ff => {
                console.log(ff)
                return res.json({
                    code: 1,
                    msg: "编辑成功！"
                })
            }).catch(err => console.log('sd'))
        })
    })
})

// 删除轮播图
router.get('/del', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    let id = req.query.id
    Focus.findOneAndDelete({
        _id: id
    }).then(ref => {
        return res.json({
            code: 1,
            msg: "删除轮播图ok！"
        })
    }).catch(err => err)
})


// 更改状态
router.get('/change', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Focus.findOne({
        _id: req.query.id
    }).then(ref => {
        if (ref) {
            if (ref.status == 1) {
                var json = {
                    status: 0
                }
            } else {
                var json = {
                    status: 1
                }
            }
            Focus.updateOne({
                _id: req.query.id
            }, json).then(() => res.json({
                code: 0,
                msg: "changeSuccess!"
            })).catch(err => res.json(err))
        }
    })



})


module.exports = router