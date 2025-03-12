const conn = require('../mariadb'); // db 모듈
const {StatusCodes} = require('http-status-codes'); // http status code 모듈

const allBooks = (req, res) => {
    let {category_id} = req.query;

    if (category_id) {
        let sql = `SELECT * FROM books WHERE category_id = ?`;
        conn.query(sql, category_id, 
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
    } else {
        // (요약된) 전체 도서 리스트
        let sql = `SELECT * FROM books`;
        conn.query(sql, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            return res.status(StatusCodes.OK).json(results);
        })
    }
};

const bookDetail = (req, res) => {
    let {id} = req.params;
    id = parseInt(id);

    let sql = `SELECT * FROM books WHERE id = ?`;
    conn.query(sql, id, 
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