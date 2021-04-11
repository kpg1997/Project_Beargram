const express = require('express');
// const app = express();
const router = express.Router();
const session = require('express-session');

router.use(
    session({
        secret:'secret',
        resave:true,
        saveUninitialized:true
    })
)
// app.use(bodyParser.json());
module.exports= router;