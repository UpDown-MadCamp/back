const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');
const bcrypt = require('bcrypt');

router.post('/login', async (req, res) => {
    try {
        console.log("요청 받음:", req.body);
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        console.log("데이터베이스 조회 결과:", user);

        if (user && user.password === password) {
            res.status(200).send("로그인 성공!");
        } else {
            res.status(400).send("아이디 또는 비밀번호가 잘못되었습니다.");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("서버 오류");
    }
});

router.post('/signup', async (req, res) => {
    try {
        const { username, password, email } = req.body;

        // 비밀번호 해시 생성
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 새로운 사용자 생성
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        // 사용자 저장
        await newUser.save();
        res.status(201).send('회원가입 성공');
    } catch (err) {
        console.error(err);
        res.status(500).send('서버 오류');
    }
});

module.exports = router;
