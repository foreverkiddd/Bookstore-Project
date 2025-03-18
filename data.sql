INSERT INTO books (title, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("어린왕자들", "종이책", 0, "어리다..", "많이 어리다..", "김어림", 100, "목차입니다.", 20000, "2019-01-01");

INSERT INTO books (title, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("신데렐라들", "종이책", 1, "유리구두..", "투명한 유리구두..", "김구두", 100, "목차입니다.", 20000, "2025-03-11");

INSERT INTO books (title, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("백설공주들", "종이책", 2, "사과..", "빨간 사과..", "김사과", 100, "목차입니다.", 20000, "2023-11-01");

INSERT INTO books (title, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("흥부와 놀부들", "종이책", 3, "제비..", "까만 제비..", "김제비", 100, "목차입니다.", 20000, "2025-03-12");

INSERT INTO books (title, img, category_id, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("콩쥐 팥쥐", 4, 0, "ebook", 4, "콩팥..", "콩심은데 콩나고..", "김콩팥", 100, "목차입니다.", 20000, "2025-03-07");

/* books 테이블이 FK로 category 테이블의 PK를 가지고 있으므로
books 테이블을 기준으로 조인 */
SELECT * FROM books LEFT JOIN category 
ON books.category_id = category.id;

/* 조인 후 books 테이블의 id값이 1인 열만 셀렉 */
SELECT * FROM books LEFT JOIN category 
ON books.category_id = category.id
WHERE books.id = 1;

INSERT INTO books (title, img, category_id, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("용궁에 간 토끼", 5, 1, "종이책", 5, "깡충..", "용왕님 하이..", "김거북", 100, "목차입니다.", 20000, "2024-10-01");

INSERT INTO books (title, img, category_id, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("해님달님", 15, 2, "ebook", 6, "동앗줄..", "황금 동앗줄..!", "김해님", 100, "목차입니다.", 20000, "2024-07-16");

INSERT INTO books (title, img, category_id, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("장화홍련전", 80, 0, "ebook", 7, "기억이 안나요..", "장화와 홍련이?..", "김장화", 100, "목차입니다.", 20000, "2024-03-01");

INSERT INTO books (title, img, category_id, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("견우와 직녀", 8, 1, "ebook", 8, "오작교!!", "칠월 칠석!!", "김다리", 100, "목차입니다.", 20000, "2025-02-01");

INSERT INTO books (title, img, category_id, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("효녀 심청", 12, 0, "종이책", 9, "심청아..", "공양미 삼백석..", "김심청", 100, "목차입니다.", 20000, "2025-01-15");

INSERT INTO books (title, img, category_id, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("혹부리 영감", 22, 2, "ebook", 10, "노래 주머니..", "혹 두개 되어버림..", "김영감", 100, "목차입니다.", 20000, "2024-06-05");

/* books 테이블에서 오늘로부터 1개월 전과 오늘 날짜의 사이(오늘로부터 1개월 전 ~ 오늘)
그리고 category_id가 0인 것을 셀렉 */
SELECT * FROM books
WHERE category_id = 0
AND  DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW();

/* 좋아요 추가 */
INSERT INTO likes (user_id, liked_book_id) VALUES (1, 1);
INSERT INTO likes (user_id, liked_book_id) VALUES (1, 2);
INSERT INTO likes (user_id, liked_book_id) VALUES (1, 3);
INSERT INTO likes (user_id, liked_book_id) VALUES (3, 1);
INSERT INTO likes (user_id, liked_book_id) VALUES (4, 4);
INSERT INTO likes (user_id, liked_book_id) VALUES (2, 1);
INSERT INTO likes (user_id, liked_book_id) VALUES (2, 2);
INSERT INTO likes (user_id, liked_book_id) VALUES (2, 3);
INSERT INTO likes (user_id, liked_book_id) VALUES (2, 5);

/* 좋아요 삭제 */
DELETE FROM likes
WHERE user_id = 1 AND liked_book_id = 3;

/* 좋아요 개수가 포함된 books 테이블 조회 */
SELECT *,
(SELECT count(*) FROM likes WHERE liked_book_id = books.id) AS likes 
FROM books;

/* 장바구니 담기 */
INSERT INTO cartItems (book_id, quantity, user_id)
VALUES (1, 1, 1);

/* 장바구니 아이템 목록 조회 */
SELECT cartItems.id, book_id, title, summary, quantity, price FROM cartItems LEFT JOIN books 
ON cartItems.book_id = books.id;

/* 장바구니 아이템 조회 */
DELETE FROM cartItems WHERE id = ?;

/* 장바구니에서 선택한(장바구니 도서 id) 아이템 목록 조회 */
SELECT * FROM Bookstore.cartItems WHERE user_id = 1 AND id IN (1, 4);

/* 주문하기 */
/* 배송 정보 입력 */
INSERT INTO delivery (address, receiver, contact) VALUES ("서울시 중구", "이정은", "010-1234-5678");
const delivery_id = SELECT MAX(id) FROM delivery;

/* 주문 정보 입력 */
INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id) VALUES ("어린 왕자들", 3, 60000, 1, delivery_id);
const order_id = SELECT MAX(id) FROM orders;

/* 주문 상세 목록 입력 */
INSERT INTO orderedBook (order_id, book_id, quantity) VALUES (order_id, 1, 1);
INSERT INTO orderedBook (order_id, book_id, quantity) VALUES (order_id, 3, 2);

SELECT MAX(id) FROM Bookstore.orderedBook;
SELECT last_insert_id();