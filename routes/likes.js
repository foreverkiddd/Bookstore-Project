const express = require('express');
const router = express.Router();
const {addLike, removeLike} = require('../controller/LikeController');

// post에서 req를 json 형태로 받기 위해
router.use(express.json());

// 좋아요 추가
router.post('/:id', addLike);

// 좋아요 취소
router.delete('/:id', removeLike);

module.exports = router;