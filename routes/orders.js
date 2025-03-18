const express = require('express');
const router = express.Router();
const { order, getOreders, getOrderDetail } = require('../controller/OrderController');

// post에서 req를 json 형태로 받기 위해
router.use(express.json());

router.post('/', order);  // 결제(주문)하기
router.get('/', getOreders);   // 주문 목록 조회
router.get('/:id', getOrderDetail);  // 주문 상세 조회

module.exports = router;