const express = require('express');
const router = express.Router();

// post에서 req를 json 형태로 받기 위해
router.use(express.json());

// 좋아요 추가
router.post('/:id', (req, res) => {
    res.json('좋아요 추가');
});

// 좋아요 취소
router.delete('/:id', (req, res) => {
    res.json('좋아요 취소');
});

module.exports = router;