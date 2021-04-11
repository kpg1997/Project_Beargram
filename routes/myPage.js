const express = require('express');
const fs = require('fs');
const router = express.Router()
const session = require('./session');
const client = require('./mysql');
const path = require('path');
const ejs = require('ejs')
const crypto = require('crypto')

router.use(session)


const key = "myKeysqweqweqwer";
const IV_LENGTH = 16;

function decrypt(text) {
    //복호화
    console.log("text", text);
    let textParts = text.split(":");
    let iv = Buffer.from(textParts.shift(), "hex");
    let encryptedText = Buffer.from(textParts.join(":"), "hex");
    let decipher = crypto.createDecipheriv("aes-128-cfb", Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
}
router.get('/showFollowerandFollow',(req,res)=>{
    console.log('followerShow')
    // 내가 팔로우 한 사람
    client.query('select grammember.userId, grammember.userImageUrl, grammember.gender from grammember join gramFollow on grammember.userId = gramFollow.gramFollowuserid  where gramFollow.gramMe  In (select gramMe from gramFollow where gramMe=?)',[req.session.userId],(err,resultMe)=>{
        // 날 팔로우 한 사람
        client.query('select grammember.userId, grammember.userImageUrl, grammember.gender from grammember join gramFollow on grammember.userId = gramFollow.gramMe  where gramFollow.gramFollowuserid  In (select gramFollowuserid from gramFollow where gramFollowuserid=?)',[req.session.userId],(err,resultfollow)=>{
            res.render('showFollowerandFollow',{
                resultMe:resultMe,
                resultfollow:resultfollow,
                data:req.session.userId,
            });
        })
    })
    
})
router.post('/myPageAjax',(req,res)=>{
    const body = req.body.userPwd
    const userId = req.session.userId
    console.log('body',body,'userId',userId)
    client.query('select * from grammember where userId = ?',[userId],(err,result)=>{
        if(result[0].userPwd!=undefined){
            const resultPwd = decrypt(result[0].userPwd);
            if(resultPwd==body){
                const rpwd = decrypt(result[0].userPwd)
                res.render('myPage',{
                    data: result[0],
                    pwd: rpwd
                })
            }else{
                res.send('<script>alert("비밀번호를 잘 못 입력하셨습니다.");history.back();</script>')
            }
        }else{
            res.send('<script>alert("비밀번호를 잘 못 입력하셨습니다.");history.back();</script>')
        }
        
    })
})

router.get('/myPagePwd',(req,res)=>{
    console.log('myPageAjax')
    res.render('myPageAjax',{data:''});
})



router.get('/:userId', (req, res) => {
    client.query('select * from grammember where userId =?', [req.params.userId], (err, result) => {
        const rpwd = decrypt(result[0].userPwd)
        res.render("myPage", {
            data: result[0],
            pwd: rpwd
        })
    })
    
})






// router.get('/test/:userId/:userPwd', (req, res) => {
//    console.log('aaa')
//     client.query('select * from grammember where userId =?', [req.params.userId], (err, result) => {
//         const rpwd = decrypt(result[0].userPwd)
//         console.log(rpwd,',',req.params.userPwd)
//         if(rpwd == req.params.userPwd){
//             fs.readFile(path.dirname(__dirname) + '/views/myPage.ejs', 'utf-8', (err, data) => {
//                 res.send(ejs.render(data, {
//                     data: result[0],
//                     pwd: rpwd
//                 }))
//             })
//         }
        
//     })
// })
module.exports = router