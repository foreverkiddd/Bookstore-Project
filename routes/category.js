const express = require('express');
const router = express.Router();
const {
    allCategory
} = require('../controller/CategoryController');

// post에서 req를 json 형태로 받기 위해
router.use(express.json());

router.get('/', allCategory);  // 카테고리 전체 목록 조회

module.exports = router;