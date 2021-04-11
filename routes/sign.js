const express = require('express');
var router = express.Router();
const ejs = require('ejs');
const client = require('./mysql');

const fs = require('fs')
const path = require('path')

const crypto = require("crypto");
const key = "myKeysqweqweqwer";
const IV_LENGTH = 16;

function encrypt(text) {
    //암호화
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv("aes-128-cfb", Buffer.from(key), iv);
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString("hex") + ":" + encrypted.toString("hex");
}
client.query("use kpg1997 ", () => {
    console.log('쿼리 연결')
});

router.get('/', function (req, res, next) {
    res.render('sign');
});

router.post('/', function (req, res, next) {
    const body = req.body;
    const pwd = encrypt(body.userPwd)
    const check = body.checkBtnselect == "on" ? 1 : 0;
    console.log(pwd)
    client.query('insert into grammember (userId,userPwd,userName,userEmail,userPhoneNumber,userBirthday,userEmailAgreement,gender) values(?,?,?,?,?,?,?,?)', [body.userId, pwd, body.userName, body.userEmail, body.userPhoneNumber, body.userBirthday, check,body.gender], (err) => {
        console.log(path.dirname(__dirname)+'/public/images/'+body.userId)
        try {
            //회원가입시 회원가입된 아이디로 폴더 생성
            fs.mkdir(path.dirname(__dirname)+'/public/images/'+body.userId,(err)=>{
                console.log('파일 생성!!!!!!')
                console.error(err);
            });
            res.render('index');
        } catch (e) {
            if ( e.code != 'EXIST' ) throw e;
        }
        console.error(err)
        
    });
});


router.get('/inspection', function (req, res, next) {
    res.render('inspection', { data: 0, result: '' });
});


router.post('/inspection', function (req, res, next) {
    let userId = req.body.data;
    client.query('select * from grammember where userId =?',[userId],(err,result)=>{
        console.error('err ==> ',err);
        console.log('result==>',result)
        console.log('boolean ==> ',result=='')
        if(result==''){
            res.send({result:true})
        }else{
            res.send({result:false})
        }
        
    })
});


// router.post('/inspection', (req, res) => {
//     console.log("ajax로 post routes 호출");
//     let inp_id = req.body.data;
//     console.log('[inp_id]',[inp_id])
//     client.query('SELECT * FROM grammember WHERE userId=?', [inp_id], (err, sql_result) => {
//         console.error(err);
//         console.log('sql_result',sql_result);

//         if(sql_result=="") {
//             res.send({result: true});
//             console.log("사용 가능 ID");
//         }
//         else {
//             res.send({result: false});
//             console.log("사용 불가 ID");
//         }
//     });
// });

router.get('useid', (req, res, next) => {
    res.render('sign');
})

// 그 체크 누르고 다시 해제 시 회원가입 버튼 disabled로 변환되지 않음 고쳐야함 
// 회원가입 시 이메일 동의 시 값이 길어 회원가입 불가능

module.exports = router;