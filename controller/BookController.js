const ensureAuthorization = require('../auth');  // 인증 모듈
const jwt = require('jsonwebtoken');
const conn = require('../mariadb'); // db 모듈
const {StatusCodes} = require('http-status-codes'); // http status code 모듈

// (카테고리별, 신간 여부) 전체 도서 목록 조회
// 전체 도서 목록 조회에서는 카테고리(소설, 동화, 사회) join 안 함 나중에 해주기
const allBooks = (req, res) => {
    let allBooksRes = {};
    let { category_id, news, limit, currentPage } = req.query;

    // limit : page 당 도서 수      ex. 3
    // currentPage : 현재 몇 페이지 ex. 1, 2, 3, ...
    // offset :                    ex. 0, 3, 6, 9, 12, ...
    //                             limit * (currentPage-1)
    let offset = limit * (currentPage - 1);

    let sql = `SELECT SQL_CALC_FOUND_ROWS *, (SELECT count(*) FROM likes WHERE liked_book_id = books.id) AS likes FROM books
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
        console.log(results);
        if (results.length)
            allBooksRes.books = results;
        else
            return res.status(StatusCodes.NOT_FOUND).end();
    })

    sql = `SELECT found_rows()`;
    conn.query(sql,
        (err, results) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        let pagination = {};
        pagination.currentPage = parseInt(currentPage);
        pagination.totalCount = results[0]["found_rows()"];

        allBooksRes.pagination = pagination;

        return res.status(StatusCodes.OK).json(allBooksRes);
    })
};

const bookDetail = (req, res) => {
    
    
    let authorization = ensureAuthorization(req, res);
    
    if(authorization instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            "message" : "로그인 세션이 만료되었습니다. 다시 로그인하세요."
        });
    } else if (authorization instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            "message" : "잘못된 토큰입니다."
        });
    } else if (authorization instanceof ReferenceError) {  // 로그인 상태가 아니면? liked 빼고 보내주면 됨
        let book_id = req.params.id;
        let sql = `SELECT *,
                    (SELECT count(*) FROM likes WHERE liked_book_id = books.id) AS likes
                FROM books
                LEFT JOIN category 
                ON books.category_id = category.category_id
                WHERE books.id = ?;`;
        let values = [book_id]
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
    } else {  // 로그인 상태이면? liked 추가해서
        let book_id = req.params.id;

        let sql = `SELECT *,
                    (SELECT count(*) FROM likes WHERE liked_book_id = books.id) AS likes,
                    (SELECT EXISTS (SELECT * FROM likes WHERE user_id = ? AND liked_book_id = ?)) AS liked
                FROM books
                LEFT JOIN category 
                ON books.category_id = category.category_id
                WHERE books.id = ?;`;
        let values = [authorization.id, book_id, book_id]
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
    }
};

module.exports = {
    allBooks,
    bookDetail
};