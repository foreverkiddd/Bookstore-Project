const {body, validationResult} = require('express-validator');
const {StatusCodes} = require('http-status-codes'); // http status code 모듈
const { passwordReset } = require('../controller/UserController');

const validate = (req, res, next) => {
    const err = validationResult(req);

    if(err.isEmpty()) { // 에러 안 남
        return next();
    } else {            // 에러 발생
        return res.status(StatusCodes.BAD_REQUEST).json(err.array());
    }
};

const userValidation = {
    join : [
        body('email').notEmpty().isEmail().withMessage('이메일 확인 필요'),
        body('password').notEmpty().isString().withMessage('비밀번호 확인 필요'),
        validate
    ], 
    login : [
        body('email').notEmpty().isEmail().withMessage('이메일 확인 필요'),
        body('password').notEmpty().isString().withMessage('비밀번호 확인 필요'),
        validate
    ], 
    passwordResetRequest : [
        body('email').notEmpty().isEmail().withMessage('이메일 확인 필요'),
        validate
    ],
    passwordReset : [
        body('email').notEmpty().isEmail().withMessage('이메일 확인 필요'),
        body('password').notEmpty().isString().withMessage('비밀번호 확인 필요'),
        validate
    ]
};

module.exports = userValidation;