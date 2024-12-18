const pool = require("../config/database");
const jwt = require("jsonwebtoken");

const SELECT_SQL =
    "users.id, users.username, users.password, users.email, users.phone, users.role, " +
    "DATE_FORMAT( CONVERT_TZ(FROM_UNIXTIME(users.last_logged_at), @@session.time_zone, '+07:00'), '%H:%i:%s %d/%m/%Y') as last_logged_at," +
    "DATE_FORMAT( CONVERT_TZ(FROM_UNIXTIME(users.updated_at), @@session.time_zone, '+07:00'), '%H:%i:%s %d/%m/%Y') as updated_at," +
    "DATE_FORMAT( CONVERT_TZ(FROM_UNIXTIME(users.created_at), @@session.time_zone, '+07:00'), '%H:%i:%s %d/%m/%Y') as created_at";
const usersController = {
    // ----------------------------------- LOGIN USER -----------------------------------
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(500).send({
                    success: false,
                    message: "Vui lòng cung cấp Email hoặc mật khẩu",
                });
            }
            const [exiting] = await pool.query(
                `SELECT ${SELECT_SQL} FROM users WHERE email = ? and password = ?`,
                [email, password]
            );
            /*
      |--------------------------------------------------------------------------
      | Cap nhap Thoi Gian Dang Nhap
      |--------------------------------------------------------------------------
      */
            await pool.query(
                "UPDATE `users` SET `last_logged_at`= unix_timestamp(NOW())"
            );

            if (exiting.length == 0) {
                return res.status(500).send({
                    success: false,
                    message: "Tên người dùng và/hoặc mật khẩu không đúng!",
                });
            }
            /*
      |--------------------------------------------------------------------------
      | Tao token
      |--------------------------------------------------------------------------
      */
            const token = jwt.sign(
                {
                    id: exiting[0].id,
                },
                process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn: "1h",
                }
            );

            res.status(200).send({
                message: "Đăng nhập thành công",
                access_token: token,
                content: exiting[0],
            });
        } catch (error) {
            res.status(500).send({
                success: false,
                message: "Error in Get All API",
                error: error,
            });
        }
    },
    // ----------------------------------- GET ALL API -----------------------------------
    getAll: async (req, res) => {
        try {
            // ----------------------------------- QUERY SQL -----------------------------------
            const [rows, fields] = await pool.query(
                `SELECT ${SELECT_SQL} FROM users`
            );
            // ----------------------------------- STATUS 404 -----------------------------------
            if (!rows) {
                return res.status(404).send({
                    success: false,
                    message: "Không tìm thấy dữ liệu",
                });
            }
            // ----------------------------------- STATUS 200 -----------------------------------
            res.status(200).send({
                message: "success",
                content: rows,
            });
        } catch (error) {
            console.log(error);
            // ----------------------------------- STATUS 500 -----------------------------------
            res.status(500).send({
                success: false,
                message: "Error in Get All API",
                error: error,
            });
        }
    },
    // ----------------------------------- GET ID API -----------------------------------
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            // ----------------------------------- STATUS 404 -----------------------------------
            if (!id) {
                return res.status(404).send({
                    success: false,
                    message: "Invalid id",
                });
            }
            // ----------------------------------- QUERY SQL -----------------------------------
            const [rows, fields] = await pool.query(
                `SELECT ${SELECT_SQL} FROM users where id = ?`,
                [id]
            );
            // ----------------------------------- STATUS 404 -----------------------------------
            if (!rows) {
                return res.status(404).send({
                    success: false,
                    message: "Không tìm thấy dữ liệu",
                });
            }
            // ----------------------------------- STATUS 200 -----------------------------------
            res.status(200).send({
                message: "success",
                content: rows,
            });
        } catch (error) {
            console.log(error);
            // ----------------------------------- STATUS 500 -----------------------------------
            res.status(500).send({
                success: false,
                message: "Error in Get by id API",
                error: error,
            });
        }
    },
    // ----------------------------------- REGISTER USER -----------------------------------
    create: async (req, res) => {
        try {
            const { username, password, email, phone, passwordConfirm } =
                req.body;

            // ----------------------------------- STATUS 500 -----------------------------------
            if (
                !username ||
                !password ||
                !email ||
                !phone ||
                !passwordConfirm
            ) {
                return res.status(500).send({
                    success: false,
                    message: "Please Provide all fields",
                });
            }

            const [exiting] = await pool.query(
                "SELECT * FROM `users` WHERE email = ? ",
                [email]
            );
            if (exiting.length > 0) {
                return res.status(500).send({
                    success: false,
                    message: "Email đã tồn tại",
                });
            } else if (password !== passwordConfirm) {
                return res.status(500).send({
                    success: false,
                    message: "Mật khẩu không khớp",
                });
            }

            // ----------------------------------- QUERY SQL -----------------------------------
            const sql =
                "INSERT INTO `users`(`username`, `password`, `email`,  `phone`, `role`,  `created_at`) VALUES (?,?,?,?,0, unix_timestamp(NOW()))";
            const [rows, fields] = await pool.query(sql, [
                username,
                password,
                email,
                phone,
            ]);
            // ----------------------------------- STATUS 404 -----------------------------------
            if (!rows) {
                return res.status(404).send({
                    success: false,
                    message: "Error In INSERT QUERY",
                });
            }
            // // ----------------------------------- STATUS 201 -----------------------------------
            res.status(201).send({
                success: true,
                message: "Đăng kí thành công",
            });
        } catch (error) {
            console.log(error);
            // ----------------------------------- STATUS 500 -----------------------------------
            res.status(500).send({
                success: false,
                message: "Error in Create API",
                error: error,
            });
        }
    },
    // ----------------------------------- PUT API -----------------------------------
    update: async (req, res) => {
        try {
            const { username, password, email, phone } = req.body;
            // ----------------------------------- ID API -----------------------------------
            const { id } = req.params;
            // ----------------------------------- STATUS 404 -----------------------------------
            if (!id) {
                return res.status(404).send({
                    success: false,
                    message: "Invalid id",
                });
            }
            // ----------------------------------- QUERY SQL-----------------------------------
            const sql =
                "UPDATE `users` SET `username`=?,`password`=?, `email`=?,`phone`=?, `update_at`= unix_timestamp(NOW()) WHERE id = ?";
            const [rows, fields] = await pool.query(sql, [
                username,
                password,
                email,
                phone,
                id,
            ]);
            // ----------------------------------- STATUS 500 -----------------------------------
            if (!rows) {
                return res.status(500).send({
                    success: false,
                    message: "Lỗi trong việc cập nhật dữ liệu",
                });
            }
            // ----------------------------------- STATUS 200 -----------------------------------
            res.status(200).send({
                success: true,
                message: "Cập nhật thành công",
            });
        } catch (error) {
            console.log(error);
            // ----------------------------------- STATUS 500 -----------------------------------
            res.status(500).send({
                success: false,
                message: "Error in Update API",
                error: error,
            });
        }
    },
    // ----------------------------------- DELETE API -----------------------------------
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            // ----------------------------------- STATUS 404 -----------------------------------
            if (!id) {
                return res.status(404).send({
                    success: false,
                    message: "Please Provide Id",
                });
            }
            // ----------------------------------- QUERY SQL-----------------------------------
            const [rows, fields] = await pool.query(
                "DELETE FROM `users` WHERE id =  ?",
                [id]
            );
            // ----------------------------------- STATUS 200 -----------------------------------
            res.status(200).send({
                success: true,
                message: "Đã xóa thành công",
            });
        } catch (error) {
            console.log(error);
            // ----------------------------------- STATUS 500 -----------------------------------
            res.status(500).send({
                success: false,
                message: "Error in Delete API",
                error: error,
            });
        }
    },
};

module.exports = usersController;
