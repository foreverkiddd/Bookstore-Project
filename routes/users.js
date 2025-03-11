const express = require('express'); // express 모듈
const router = express.Router();
const {
    join,
    login,
    passwordResetRequest,
    passwordReset
} = require('../controller/UserController');
const userValidation = require('../validators/userValidator');

// post에서 req를 json 형태로 받기 위해
router.use(express.json());

router.post('/join', userValidation.join, join);  // 회원가입
router.post('/login', userValidation.login, login);  // 로그인
router.post('/reset', userValidation.passwordResetRequest, passwordResetRequest);  // 비밀번호 초기화 요청
router.put('/reset', userValidation.passwordReset, passwordReset);  // 비밀번호 초기화

module.exports = router;