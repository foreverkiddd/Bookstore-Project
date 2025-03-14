const conn = require('../mariadb'); // db 모듈
const {StatusCodes} = require('http-status-codes'); // http status code 모듈

// (카테고리별, 신간 여부) 전체 도서 목록 조회
// 전체 도서 목록 조회에서는 카테고리(소설, 동화, 사회) join 안 함 나중에 해주기
const allBooks = (req, res) => {
    let { category_id, news, limit, currentPage } = req.query;

    // limit : page 당 도서 수      ex. 3
    // currentPage : 현재 몇 페이지 ex. 1, 2, 3, ...
    // offset :                    ex. 0, 3, 6, 9, 12, ...
    //                             limit * (currentPage-1)
    let offset = limit * (currentPage - 1);

    let sql = `SELECT *, (SELECT count(*) FROM likes WHERE liked_book_id = books.id) AS likes FROM books
                LEFT JOIN category ON books.category_id = category.category_id`;  // 뒤에 아무것도 붙지 않으면 전체 조회
    let values = [];
    if (category_id && news) {  // 카테고리별 신간 조회
        sql += ` WHERE books.category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`;
        values = [category_id];
    } else if (category_id) {   // 카테고리별 조회
        sql += ` WHERE books.category_id = ?`;
        values = [category_id];
    } else if (news) {  // 신간 조회
        sql += ` WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`;
    }

    sql += ` LIMIT ? OFFSET ?`;
    values.push(parseInt(limit), offset);

    conn.query(sql, values, 
        (err, results) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        if (results.length)
            return res.status(StatusCodes.OK).json(results);
        else
            return res.status(StatusCodes.NOT_FOUND).end();
    })
};

const bookDetail = (req, res) => {
    let {user_id} = req.body;
    let book_id = req.params.id;

    let sql = `SELECT *,
                (SELECT count(*) FROM likes WHERE liked_book_id = books.id) AS likes,
                (SELECT EXISTS (SELECT * FROM likes WHERE user_id = ? AND liked_book_id = ?)) AS liked
            FROM books
            LEFT JOIN category 
            ON books.category_id = category.category_id
            WHERE books.id = ?;`;
    let values = [user_id, book_id, book_id]
    conn.query(sql, values, 
        (err, results) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }


        // id 값으로 해당 도서가 있는지 확인
        if (results[0])
            return res.status(StatusCodes.OK).json(results[0]);
        else
            return res.status(StatusCodes.NOT_FOUND).end();
    })
};

module.exports = {
    allBooks,
    bookDetail
};