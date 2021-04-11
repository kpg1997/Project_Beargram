const express = require('express');
const router = express.Router();
const client = require('./mysql');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const session = require('./session')
const moment = require('moment');

const ejs = require('ejs')

const maxFileCount = 4;// 파일 최대 개수
const maxFileSize = 3 * 1000 * 1000 // 파일 사이즈
const filePath = 'public/images/' //기본 파일 업로드 경로

router.use(session);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.dirname(__dirname) + '/public/images/' + req.session.userId)
    },
    filename: function (req, file, cb) {
        
        cb(null, new Date().valueOf() + '_' + file.originalname)
    },
    limit: { fileSize: 5 * 1024 * 1024 },
})
const upload = multer({ storage: storage })

router.get('/', (req, res, next) => {
        console.log('mainBoard')
        client.query('select grammember.userId, grammember.userImageUrl, grammember.gender, gramBoard.gramNo, grammember.userName, gramBoard.gramImageUrl,gramBoard.gramContents, gramBoard.gramDate from grammember join gramBoard on grammember.userId =gramBoard.userId WHERE grammember.userId IN (select gramFollowuserid from gramFollow where gramMe=?) order by gramBoard.gramNo desc',[req.session.userId], (err, result) => {
            // res.render('mainBoard', { board: result });
            console.log('req.session.userId==>',req.session.userId)
            if (result == undefined) {
                res.render('mainBoard',{
                    data: ''
                })
            } else {
                res.render('mainBoard',{
                    data: result
                })
            }
        })
    
});
router.get('/makeBoard', (req, res, next) => {
    res.render('makeBoard')
})
router.post('/makeBoard', upload.array('gramImageUrl', 3), (req, res, err) => {
    console.error(err)
    const body = req.body
    console.log('upload', req.files)
    if (req.files == '') {
        client.query('insert into gramBoard (userId, gramContents) values(?,?)', [req.session.userId, body.gramContents], (err) => {
            console.error(err);
            console.log('여기로 오는데 무엇?')
            res.redirect('/mainBoard');
        })
    } else {
        const fileName = req.files[0].filename;
        console.log('fileName : ', fileName);
        client.query('insert into gramBoard (userId, gramContents, gramImageUrl) values(?,?,?)', [req.session.userId, body.gramContents, fileName], (err) => {
            console.error(err);
            res.redirect('/mainBoard');
        })
    }

})
router.get('/pushed-like',(req,res)=>{
    client.query('SELECT * FROM gramBoard JOIN gramBoardLike ON gramBoard.gramNo = gramBoardLike.likeBoardNo JOIN grammember ON gramBoardLike.likeuserId =grammember.userId WHERE gramBoardLike.likeuserId = ?',[req.session.userId],(err,result)=>{
        console.log('pushed',result)
        res.render('mainBoard',{
            data:result
        })
    })
})


router.post('/likeBoard',(req,res)=>{
    console.log('likeBoard')
    let gramNo = req.body.data;
    client.query('insert into gramBoardLike (likeuserId,likeBoardNo) values (?,?)',[req.session.userId,gramNo],()=>{
        // client.query('select count(*) from gramBoardLike where likeBoardNo =?',[gramNo],(err,result)=>{
            res.send({result:true})
        // })
    })
})

router.post('/UnlikeBoard',(req,res)=>{
    console.log('UnlikeBoard')
    let gramNo = req.body.data;
    client.query('delete from gramBoardLike where likeuserId=? and likeBoardNo=?',[req.session.userId,gramNo],()=>{
        // client.query('select count(*) from gramBoardLike where likeBoardNo =?',[gramNo],(err,result)=>{
            res.send({result:true})
        // })
    })
})

router.post('/GetlikeBoard',(req,res)=>{
    console.log('GetlikeBoard')
    let gramNo = req.body.data;
    console.log('get gramNo',gramNo)
    client.query('select * from gramBoardLike where likeuserId=? and  likeBoardNo=?',[req.session.userId,gramNo],(err,result)=>{
        console.log('result=>',result)
        if(result==''){
            res.send({result:'0'})
        }else{
            res.send({result:'1'})
        }
    })
})

router.post('/GetlikeBoardSu',(req,res)=>{
    console.log('GetlikeBoard')
    let gramNo = req.body.data;
    console.log('get gramNo',gramNo)
    client.query('select count(*) from gramBoardLike where likeBoardNo=?',[gramNo],(err,result)=>{
        console.log('result=>',result)
        if(result==undefined){
            console.log(result)
            res.send({result:0})
          }else{
            const count = result[0]
            console.log('count[0]',count[Object.keys(count)[0]]);
            const ersu = count[Object.keys(count)[0]];
            res.send({result:ersu})
          }
    })
})

router.post('/reply/:gramNo',(req,res)=>{
    console.log('insert reply')
    console.log('[req.params.gramNo,req.session.userId,req.body.reply] ==> '+[req.params.gramNo, req.session.userId, req.body.reply])
    client.query('insert into gramBoardReply (replyNo,userId,reply) values (?,?,?)',[req.params.gramNo,req.session.userId,req.body.reply],()=>{
        console.log('aa');
        client.query('select * from gramBoard where gramNo = ?',[req.params.gramNo],(err,gramResult)=>{
            console.log('gramResult[0].userId==>',gramResult[0].userId,',==>',req.params.gramNo)
            console.log('/mainBoard/'+gramResult[0].userId+'/'+req.params.gramNo)
            res.redirect('/mainBoard/detailBoard/'+req.params.gramNo)
        })
    })
})


router.get('/:userId', (req, res, next) => {
    console.log('내가쓴 게시물')
    console.log('req.params.userId :', req.params.userId)
    client.query('select * from grammember where userId=?',[req.session.userId],(err,myresult)=>{
        client.query('select * from gramBoard where userId = ? order by gramNo desc', [req.params.userId], (err, result) => {
            console.log('res', result)
            console.log(req.session.userId)
            if (result[0] == undefined) {
                res.render('board', {
                    data: result,
                    loginUser: req.session.userId,
                    myProfile:myresult[0]
                })
            } else {
                res.render('board', {
                    data: result,
                    loginUser: req.session.userId,
                    myProfile:myresult[0]
                })
            }
            })
    })
    
})


router.get('/deleteBoard/:gramNo', (req, res) => {
    const gramNo = req.params.gramNo
    console.log('gramNo : ', gramNo);
    client.query('select * from gramBoard where gramNo = ?', [gramNo], (err, result) => {
        const img = result[0].gramImageUrl
        const user = result[0].userId
        if(req.session.userId == user){
            client.query('delete from gramBoard where gramNo = ?', [gramNo], () => {
            client.query('delete from gramBoardReply where replyNo = ? ',[gramNo],()=>{
                console.log('public/images/' + user + '/' + img)
                console.log('delete gramNo ==> ',gramNo )
                fs.unlink(path.dirname(__dirname) + '/public/images/' + user + '/' + img, (err) => {
                    console.error(err);
                })
                    res.redirect('/mainBoard/' + req.session.userId)
                })
            })
        }else{
            res.send('<script>alert("잘못된 접근입니다.");history.back();</script>')
        }
    });
})




router.get('/updateBoard/:gramNo', (req, res) => {
    console.log('수정 페이지로')
    client.query('select * from gramBoard where gramNo = ? ', [req.params.gramNo], (err, result) => {
        if(result[0].userId == req.session.userId){
            console.log(result[0]);
            res.render('updateBoard', { data: result[0] })
        }else{
            res.send('<script>alert("잘못된 접근입니다.");history.back();</script>')
        }
    })
})

router.post('/userId/:userId', (req, res) => {
    // 사용자 아이디 검색
    console.log('search userId ==>', req.params.userId)
    client.query('select * from grammember where userId like ?', ["%" + req.params.userId + "%"], (err, result) => {
        res.render("finduser", {
            searchMid: '유저 아이디',
            data: result,
            search: req.params.userId,
            select:'userid'
        })
    })
})

router.post('/userName/:userName', (req, res) => {
    // 사용자 이름 검색
    // console.log('search gramContents ==>',req.params.gramContents)
    client.query('select * from grammember where userName like ?', ["%" + req.params.userName + "%"], (err, result) => {
        console.log('userName=> ', result)
        console.log('userName=> ', req.params.userName)
        res.render("finduser", {
            searchMid: '유저 이름',
            data: result,
            search: req.params.userName,
            select:'username'
        })
    })
})

router.post('/gramContents/:gramContents', (req, res) => {
    // 게시글 검색
    // console.log('search gramContents ==>',req.params.gramContents)
    client.query('SELECT grammember.userName,grammember.gender,grammember.userId,grammember.userImageUrl,gramBoard.gramContents,gramBoard.gramNo,gramBoard.gramDate,gramBoard.gramImageUrl FROM grammember JOIN gramBoard ON grammember.userId =gramBoard.userId WHERE gramBoard.gramContents LIKE ? order by gramNo desc', ["%" + req.params.gramContents + "%"], (err, result) => {
        res.render("findBoard", {
            searchMid: '게시글',
            data: result,
            search: req.params.gramContents
        })
    })
})


router.post('/updateBoard/:gramNo', upload.array('gramImageUrl', 3), (req, res) => {
    console.log('게시글 수정 ')
    client.query('select * from gramBoard where gramNo= ? ', [req.params.gramNo], (err, result) => {
        const selectImage = result[0].gramImageUrl;
        const user = result[0].userId
        console.log('selectImage,user ==> ', selectImage, user)
        if(user == req.session.userId){
            if (req.files == '') {
                // 바꿀 게시글 사진 없을 때
                client.query('update gramBoard set gramContents = ? where gramNo= ? ', [req.body.gramContents, req.params.gramNo], () => {
                    res.redirect('/mainBoard/' + req.session.userId)
                })
            } else {
                // 바꿀 게시글 사진 있을 때
                const fileName = req.files[0].filename;
                client.query('update gramBoard set gramContents = ?, gramImageUrl = ? where gramNo= ? ', [req.body.gramContents, fileName, req.params.gramNo], () => {
                    fs.unlink(path.dirname(__dirname) + '/public/images/' + user + '/' + selectImage, (err) => {

                        console.log("이미지 변경", path.dirname(__dirname) + '/public/images/' + user + '/' + selectImage)
                        console.error(err);
                    })
                    res.redirect('/mainBoard/' + req.session.userId)
                })
            }
        }else{
            res.send('<script>alert("잘못된 접근입니다.");history.back();</script>')
        }
    });

})





router.get('/detailBoard/:gramNo', (req, res) => {
    console.log('detail');
    client.query('select grammember.userId, grammember.userImageUrl, grammember.gender, gramBoard.gramNo, grammember.userName, gramBoard.gramImageUrl,gramBoard.gramContents, gramBoard.gramDate from grammember join gramBoard on grammember.userId =gramBoard.userId WHERE gramNo=?', [req.params.gramNo], (err, result) => {
        client.query('select grammember.userId, grammember.userImageUrl, grammember.gender, grammember.userName,  gramBoardReply.reply, gramBoardReply.replyDate from grammember join gramBoardReply on grammember.userId = gramBoardReply.userId where gramBoardReply.replyNo= ? order by replyDate',[req.params.gramNo],(err,replyresult)=>{
            const date = new Date(result[0].gramDate);
            const sdate = date.getFullYear() + '년' + (date.getMonth() + 1) + '월' + date.getDate() + '일'
            res.render("detailboard", {
                data: result,
                date: sdate,
                reply:replyresult,
                session: req.session.userId
            })
        })
    })
})






module.exports = router