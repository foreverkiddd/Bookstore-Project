const express = require('express');
const router = express.Router();

// post에서 req를 json 형태로 받기 위해
router.use(express.json());

// 결제(주문)하기
router.post('/', (req, res) => {
    res.json('결제하기');
});

// 주문 목록 조회
router.get('/', (req, res) => {
    res.json('주문 목록 조회');
});

// 주문 상세 상품 정보 조회
router.get('/:id', (req, res) => {
    res.json('주문 상세 상품 정보 조회');
});

module.exports = router;