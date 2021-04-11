const express = require('express');
const router = express.Router();
const session = require('./session');
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const client = require('./mysql');

router.use(session);

router.get('/', (req, res, next) => {
    const IdSession = req.session.userId;
    const NameSession = req.session.userName;
    console.log("IdSession, NameSession ==>",IdSession, NameSession)
    if(req.session.userId==undefined){
        res.send('<script>alert("로그인페이지로 이동합니다.");location.href="/"</script>')
    }else{
        client.query('select * from grammember where userId=?',[req.session.userId],(err,result)=>{
        console.log('result[0].gramImageUrl',result)
        res.render("header", {
            loginUserId: req.session.userId,
            loginUserName:req.session.userName,
            img:result[0].userImageUrl,
            gender:result[0].gender,

        });
    })
    }
})
module.exports = router