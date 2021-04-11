const express = require('express');
const router = express.Router();
const client = require('./mysql');
const session = require('./session');
const crypto = require('crypto');

const key = "myKeysqweqweqwer";
const IV_LENGTH = 16;

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

    return decrypted.toString();
}
router.use(session);

router.post('/', (req, res, next) => {
    const body = req.body
    client.query('select * from grammember where userId=?', [body.userId], (err, result) => {
        console.log(result)
        if (result == '') {
            res.send("<script>alert('없는 사용자 입니다.');history.back();</script>")
        } else {
            console.log('result[0] ==>',(result[0]));
            const pwd = decrypt(result[0].userPwd);
            console.log('login-pwd : '+pwd);
            if (pwd == req.body.userPwd) {
                req.session.loggedin = true;
                req.session.userId = result[0].userId;
                req.session.userName = result[0].userName
                console.log(req.session,'여기')
                req.session.save(() => {
                    res.redirect('/mainBoard');
                })
            } else {
                res.send("<script>alert('아이디 또는 비밀번호가 틀립니다.');history.back();</script>")
            }
        }
    })
})
router.post('/', (req, res, next) => {
    
});
router.get('/logout',(req,res,next)=>{
    req.session.destroy(function () {
        req.session
    })
    console.log(req.session)
    res.redirect('/');
})

module.exports = router;