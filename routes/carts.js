const express = require('express');
const router = express.Router();
const {addToCart, getCartItems, deleteCartItems} = require('../controller/CartItemsController');

// post에서 req를 json 형태로 받기 위해
router.use(express.json());

router.post('/', addToCart);    // 장바구니 담기
router.get('/', getCartItems);  // 장바구니 아이템 조회 / 선택된 장바구니 아이템 목록 조회
router.delete('/:id', deleteCartItems);  // 장바구니 도서 삭제

module.exports = router;