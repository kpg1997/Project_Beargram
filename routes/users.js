var express = require('express');
var router = express.Router();
const client = require('./mysql');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs')
const session = require('./session')
const multer = require('multer');



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.dirname(__dirname)+'/public/images/' + req.session.userId)
  },
  filename: function (req, file, cb) {
    cb(null, 'profile_' + file.originalname)
  }
})
const upload = multer({ storage: storage })
router.use(session)



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

function decrypt(text) {
  //복호화
  console.log('복호화')
  console.log("text", text);
  let textParts = text.split(":");
  let iv = Buffer.from(textParts.shift(), "hex");
  let encryptedText = Buffer.from(textParts.join(":"), "hex");
  let decipher = crypto.createDecipheriv("aes-128-cfb", Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);
  console.log('복호화 안에서 : ', decrypted.toString())

  return decrypted.toString();
}
router.post('/change',(req,res)=>{
  const body = req.body;
  const pwd =encrypt(body.userPwd)
  console.log(body.userPwd)
  console.log(pwd)
  client.query('update grammember set userPwd = ? where userid =? ',[pwd,body.pwdchangeuserId],()=>{
    res.send('<script>alert("비밀번호가 변경되었습니다!!");self.close();</script>')
  })
})

router.get('/find/id',(req,res)=>{
  res.render('findId',{data:''})
})

// router.get('/withdrawal',(req,res)=>{
//   const userid = req.session.userId;
//   console.log('회원 탈퇴 하는 아이디 ==> ',userid)
//   client.query('delete from grammember where userId = ?',[userid],()=>{
//     console.log('1')
//     client.query('delete from gramBoard where userId = ?',[userid],()=>{
//       console.log('12')
//       client.query('delete from gramBoardLike where likeuserId = ?',[userid],()=>{
//         console.log('123')
//         client.query('delete from gramBoardReply where userId = ?',[userid],()=>{
//           console.log('1234')
//           client.query('delete from gramDmContents where dmuserId = ?',[userid],()=>{
//             console.log('12345')
//             client.query('delete from gramDmList where dmuserId = ? or otherUserId',[userid,userid],()=>{
//               console.log('123456')
//               client.query('delete from gramFollow where gramMe = ? or gramFollowuserid',[userid,userid],()=>{
//                 console.log('1234578')
//                 fs.unlink(path.dirname(__dirname)+'/public/images/' + userid, (err) => {
//                   console.error(err);
//                   })
//                   req.session.destroy(function () {
//                     req.session
//                   })
//                   res.redirect('/');
//               })
//             })
//           })
//         })
//       })
//     })
//   })
// })

router.post('/find/id',(req,res)=>{
  const body = req.body
  console.log('find/id')
    client.query('select * from grammember where userName=? and userPhoneNumber=? and userBirthday=?',[body.userName,body.userPhoneNumber,body.userBirthday],(err,result)=>{
      console.log('result==>',result)
      if(result == ''){
          res.send('<script>alert("없는  정보이거나 잘못입력한 정보가 있습니다.");history.back();</script>')
      }else{
        console.log('hello')
        res.render('findId',{data:result[0].userId})
      }
    }
  )
})

router.get('/find/pwd',(req,res)=>{
    res.render("findPwd",{data:''})
})
router.post('/find/pwd',(req,res)=>{
  const body = req.body
  console.log('find/pwd')
  client.query('select * from grammember where userId=? and userName=? and userPhoneNumber=? and userBirthday=?',[body.userId,body.userName,body.userPhoneNumber,body.userBirthday],(err,result)=>{
    if(result == ''){
      res.send('<script>alert("없는 정보이거나 잘못입력한 정보가 있습니다.");history.back();</script>')
    }else{
        res.render("findPwdChange",{data:result[0]})
    }
  })
})


//팔로잉 기능





/*프로필 이미지가 있는 경우*/
router.post('/:userId/:userImageUrl', upload.single('userImageUrl'), (req, res, next) => {
  console.log('update grammember')
  const body = req.body
  var pwd = encrypt(body.userPwd);

  if (body.userPwd.length < 8) {
    res.send("<script>alert('비밀번호 9자리를 입력하시오');history.back();</script>")
  } else {
    var spwd = '';
    client.query('select * from grammember where userId =?', [req.session.userId], (err, result) => {
      spwd = (result[0].userPwd)
      console.log('db 값 : ', result[0].userPwd)
      console.log('암호화', spwd)
      const dpwd = decrypt(spwd)              // 복호화된 비번
      console.log('복호화!!!', dpwd)
      console.log(req.file)
      const beforeImage = result[0].userImageUrl;
      if (req.file == undefined) {
        client.query('update grammember set userName =? , userPwd=?, userPhoneNumber=? ,userEmail=? where userId=?', [body.userName, pwd, body.userPhoneNumber, body.userEmail, req.session.userId], () => {
          if (body.userPwd == dpwd) {
            console.log('비번 변경ㄴㄴ')
            res.redirect('/mainBoard');
          } else {
            console.log('비번 변경')
            req.session.destroy(function () {
              req.session
            })
            res.redirect('/');
          }
        })
      } else {
        const file = 'profile_' + req.file.originalname
        client.query('update grammember set userName =? , userPwd=?, userPhoneNumber=? ,userEmail=?, userImageUrl=? where userId=?', [body.userName, pwd, body.userPhoneNumber, body.userEmail, file, req.session.userId], () => {
          if (file != '') {
            if(beforeImage!=req.params.userImageUrl){
                fs.unlink(path.dirname(__dirname)+'/public/images/' + req.session.userId + '/' + req.params.userImageUrl, (err) => {
                console.error(err);
                })
            }
            
          }

          if (body.userPwd == dpwd) {
            console.log('비번 변경ㄴㄴ');
            res.redirect('/mainBoard');
          } else {
            console.log('비번 변경')
            req.session.destroy(function () {
              req.session
            })
            res.redirect('/');
          }
        })
      }

    });
  }


});

router.post('/insert',(req,res)=>{
  console.log('팔로우 isnert');
  client.query('insert into gramFollow (gramMe,gramFollowuserid) values (?,?)',[req.session.userId,req.body.data],()=>{
    res.send({result:true})
  })
})

router.post('/delete',(req,res)=>{
  console.log('팔로우 delete');
  client.query('delete from gramFollow where gramMe =? and gramFollowuserid=?',[req.session.userId,req.body.data],()=>{
    res.send({result:true})
  })
})

router.post('/followerSum',async (req,res)=>{
  console.log('ajax 실행 !! ',req.body.data);
  console.log('여기?')
  client.query('select count(*) from gramFollow where gramFollowuserid = ? ',[req.body.data],(err,result)=>{
    console.log('result ==> ',result);
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

router.post('/atag',async (req,res)=>{
  console.log('ajax 실행 !!  atag',req.body.data,req.session.userId);
  client.query('select * from gramFollow where gramFollowuserid = ? and gramMe=?',[req.body.data,req.session.userId],(err,result)=>{
    console.log('result atag ==> ',result);
    if(result==''){
      console.log(result)
      res.send({result:true})
    }else{
      res.send({result:false})
    }
  })
});

router.post('/followSum',async (req,res)=>{
  console.log('ajax 실행 !! ',req.body.data);
  client.query('select count(*) from gramFollow where gramMe = ? ',[req.body.data],(err,result)=>{
    console.log('follow !! ==> ',result);
    if(result==undefined){
      console.log(result)
      res.send({result:0})
    }else{
      const count = result[0]
      console.log('count[0]',count[Object.keys(count)[0]]);
      const wsu = count[Object.keys(count)[0]];
      res.send({result:wsu})
    }
  })
})
/* 프로필 이미지가 없는 경우*/
router.post('/:userId', upload.single('userImageUrl'), (req, res, next) => {
  console.log('update grammember no img')
  const body = req.body

  var pwd = encrypt(body.userPwd);
  console.log('입력한 값 : ', pwd)
  // console.log('암호화', pwd)
  // const selectpwd = spwd(req.session.userId);
  // console.log('selectpwd : ', selectpwd)

  if (body.userPwd.length < 8) {
    res.send("<script>alert('비밀번호 9자리를 입력하시오');history.back();</script>")
  } else {
    var spwd = '';
    client.query('select userPwd from grammember where userId =?', [req.session.userId], (err, result) => {
      console.log('db 값 : ', result[0].userPwd)
      spwd = (result[0].userPwd) // 암호화된 비번
      console.log('암호화 된', spwd)
      const dpwd = decrypt(spwd)              // 복호화된 비번
      console.log('복호화', dpwd)

      console.log('req.file',req.file)

      if (req.file == undefined) {
        console.log('no image')
        client.query('update grammember set userName =? , userPwd=?, userPhoneNumber=? ,userEmail=? where userId=?', [body.userName, pwd, body.userPhoneNumber, body.userEmail, req.session.userId], () => {
          console.log("body.userPwd == spwd :", pwd == spwd, '==>pwd :', pwd, '==>spwd:', spwd)
          if (body.userPwd == dpwd) {
            console.log('비번 변경ㄴㄴ')
            res.redirect('/mainBoard');
          } else {
            console.log('비번 변경')
            req.session.destroy(function () {
              req.session
            })
            res.redirect('/');
          }
        })
      } else {
        console.log('yes image')
        const file = 'profile_' + req.file.originalname
        client.query('update grammember set userName =? , userPwd=?, userPhoneNumber=? ,userEmail=?, userImageUrl=? where userId=?', [body.userName, pwd, body.userPhoneNumber, body.userEmail, file, req.session.userId], () => {
          if (body.userPwd == dpwd) {
            console.log('비번 변경ㄴㄴ')
            res.redirect('/mainBoard');
          } else {
            console.log('비번 변경')
            req.session.destroy(function () {
              req.session
            })
            res.redirect('/');
          }
        })
      }
    });
  }

});




router.get('/findUser/:userId',(req,res)=>{
  //유저 아이디로 찾기
  const uId=req.params.userId;
  console.log('find',uId)
  client.query('select * from grammember where userId = ?',[uId],(err,mresult)=>{
    const member = mresult;
    console.log('find',member)
    const date = new Date(member[0].userBirthday);
    console.log('date : ',date);
    const fdate = date.getFullYear() + '년' + (date.getMonth() + 1) + '월' + date.getDate() + '일'
    client.query('select * from gramBoard where userId = ? order by gramNo desc',[uId],(err,bresult)=>{
      const mBoard = bresult;
      console.log('find',mBoard)
      res.render("detailFindUser",{
        user:member,  //유저 정보
        board:mBoard, //유저가 작성한 게시글 목록들
        birth:fdate,
        session:req.session.userId
      })
    })
  })
})





module.exports = router;
