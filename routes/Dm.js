const express = require('express');
const session = require('./session');
const router = express.Router();
const client = require('./mysql');
var http = require('http').Server(router); //1
var io = require('socket.io')(http); 

router.use(session)
// router.get('/',(req,res)=>{
//     res.render('DmPage')
    
// })
router.get('/start/:otherUserId',(req,res)=>{
    client.query('select * from gramDmList where (dmuserId = ? and otherUserId=?) or (dmuserId = ? and otherUserId=?)',[req.session.userId,req.params.otherUserId,req.params.otherUserId,req.session.userId],(err,result)=>{
        console.log('result[0] ==>',result[0])
        if(result[0]==undefined){
            client.query('insert into gramDmList (dmuserId,otherUserId) values (?,?) ',[req.session.userId,req.params.otherUserId],()=>{
                console.log('aa')
                res.redirect('/Dm/list');
            })
        }else{
            console.log('bbbb')
            res.redirect('/Dm/list');
        }
       
    })
   
})


router.post('/insert/:gramDmNo/:comment',(req,res)=>{
    client.query('select * from gramDmList WHERE gramDmNo=? AND (dmuserId=? OR otherUserId=?)',[req.params.gramDmNo,req.session.userId,req.session.userId],(err,joinDm)=>{
        console.log('[req.params.gramNo,req.session.userId,req.session.userId]',[req.params.gramDmNo,req.session.userId,req.session.userId])
        if(joinDm[0] != undefined){
            client.query('insert into gramDmContents (gramDmNo,dmuserId,comment) values (?,?,?)',[req.params.gramDmNo,req.session.userId,req.params.comment],()=>{
                // res.redirect('/Dm/List/'+req.params.gramDmNo);
                res.send({result:''})
            })
        }else{
            res.send('<script>alert("잘못된 접근입니다.");history.back();</script>')
        }
    });
})


router.get('/list',(req,res)=>{
    console.log('/list')
    client.query('select grammember.userId, grammember.userImageUrl, grammember.gender, gramDmList.dmuserId, gramDmList.gramDmNo, gramDmList.otherUserId from grammember join gramDmList on  (grammember.userId=gramDmList.dmuserId) OR (grammember.userId=gramDmList.otherUserId) where gramDmList.dmuserId =? or gramDmList.otherUserId= ?',[req.session.userId,req.session.userId],(err,result)=>{
        console.log('result ==> ',result)
        let arr = new Array();
        arr.push(result)
        console.log('arr ==> ', arr)
        res.render('DmList',{
            user : req.session.userId,
            list:result,
        })
    })
});

router.post('/List/select/gramDmNo',(req,res)=>{
    client.query('select grammember.userId, grammember.userImageUrl, grammember.gender, gramDmContents.gramDmNo, gramDmContents.dmuserId, gramDmContents.comment, gramDmContents.commentTime from grammember join gramDmContents on grammember.userId = gramDmContents.dmuserId where gramDmContents.gramDmNo = ? order by gramDmContents.commentTime',[req.body.gramDmNo],(err,result)=>{
        res.send({result:result});  
    })
})

router.post('/NoReadDm',(req,res)=>{
    client.query('select count(case when readNo=1 then 1 end) from gramDmContents where dmuserId = ? and gramDmNo =?',(err,result)=>{
        console.log('noread ==> ',result)
        // res.send({result:result[0]})
    })
})


router.get('/List/:gramDmNo',(req,res)=>{
    console.log('/List/:gramDmNo')
    // client.query('select * from gramDmList where (userId = ? and otherUserId=?) or (userId = ? and otherUserId=?)',[req.session.userId,req.params.otherUserId,req.params.otherUserId,req.session.userId],(err,result)=>{
    //     const gramNo = result[0].gramDmNo;
    console.log('[req.params.gramNo,req.session.userId,req.session.userId]',[req.params.gramDmNo,req.session.userId,req.session.userId])
    client.query('select * from gramDmList WHERE gramDmNo=? AND (dmuserId=? OR otherUserId=?)',[req.params.gramDmNo,req.session.userId,req.session.userId],(err,joinDm)=>{
        console.log('joinDm==>',joinDm[0])
        if(joinDm[0] != undefined){
            client.query('select grammember.userId, grammember.userImageUrl, grammember.gender, gramDmContents.gramDmNo, gramDmContents.dmuserId, gramDmContents.comment, gramDmContents.commentTime from grammember join gramDmContents on grammember.userId = gramDmContents.dmuserId where gramDmContents.gramDmNo = ? order by gramDmContents.commentTime',[req.params.gramDmNo],(err,result)=>{
                if(joinDm[0].dmuserId == req.session.userId){
                    client.query('update gramDmContents set  readNo="0" where gramDmNo =? and dmuserId =?',[joinDm[0].gramDmNo,joinDm[0].otherUserId],()=>{
                        console.log('select * from')
                        console.log('send')
                        res.render('DmSend',{
                            comment:result,
                            gramDmNo:req.params.gramDmNo,
                            session : req.session.userId
                        })
                    })
                }else if(joinDm[0].otherUserId == req.session.userId){
                    client.query('update gramDmContents set  readNo="0" where gramDmNo =? and dmuserId =?',[joinDm[0].gramDmNo,joinDm[0].dmuserId],()=>{
                        console.log('select * from')
                        console.log('send')
                        res.render('DmSend',{
                            comment:result,
                            gramDmNo:req.params.gramDmNo,
                            session : req.session.userId
                        })
                    })
                }
            })
        }else{
            res.send('<script>alert("잘못된 접근입니다.");history.back();</script>')
        }
    })
        
    // })
})



module.exports=router;