const pool = require("../config/database");

const SELECT_SQL = `films.id, films.name, films.describe, films.trailer, films.cens, films.genres, 
    DATE_FORMAT( CONVERT_TZ(FROM_UNIXTIME(films.releases), @@session.time_zone, '+07:00'), '%d/%m/%Y') as releases, 
    duration, films.poster, films.backdrop, films.country, films.director, films.producer, films.actor, 
    DATE_FORMAT( CONVERT_TZ(FROM_UNIXTIME(films.updated_at), @@session.time_zone, '+07:00'), '%H:%i:%s %d/%m/%Y') as updated_at, 
    DATE_FORMAT( CONVERT_TZ(FROM_UNIXTIME(films.created_at), @@session.time_zone, '+07:00'), '%H:%i:%s %d/%m/%Y') as created_at`;

const filmController = {
    // ----------------------------------- GET ALL API -----------------------------------
    getAll: async (req, res) => {
        try {
            // ----------------------------------- QUERY SQL -----------------------------------
            const [rows, fields] = await pool.query(
                `SELECT ${SELECT_SQL} FROM films`
            );
            // ----------------------------------- STATUS 404 -----------------------------------
            if (!rows) {
                return res.status(404).send({
                    status: 404,
                    success: false,
                    message: "No Records found",
                });
            }
            // ----------------------------------- STATUS 200 -----------------------------------
            res.status(200).send({
                status: 200,
                success: "success",
                content: rows,
            });
        } catch (error) {
            console.log(error);
            // ----------------------------------- STATUS 500 -----------------------------------
            res.status(500).send({
                status: 500,
                success: false,
                message: "Error in Get All API",
                error,
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
                    status: 404,
                    success: false,
                    message: "Invalid Or Provide id",
                });
            }
            // ----------------------------------- QUERY SQL -----------------------------------
            const [rows, fields] = await pool.query(
                `select ${SELECT_SQL} from films where id = ?`,
                [id]
            );

            // ----------------------------------- STATUS 404 -----------------------------------
            if (rows.length === 0) {
                return res.status(404).send({
                    status: 404,
                    success: false,
                    message: "No Records found",
                });
            }
            // ----------------------------------- STATUS 200 -----------------------------------
            res.status(200).send({
                status: 200,
                success: true,
                content: rows,
            });
        } catch (error) {
            console.log(error);
            // ----------------------------------- STATUS 500 -----------------------------------
            res.status(500).send({
                status: 500,
                success: false,
                message: "Error in Get by id API",
                error,
            });
        }
    },
    // ----------------------------------- POST API -----------------------------------
    create: async (req, res) => {
        try {
            const { poster, backdrop } = req.files;
            const {
                name,
                describe,
                trailer,
                cens,
                genres,
                releases,
                duration,
                country,
                director,
                producer,
                actor,
            } = req.body;

            // ----------------------------------- STATUS 500 -----------------------------------
            if (
                !name ||
                !describe ||
                !trailer ||
                !cens ||
                !genres ||
                !releases ||
                !duration ||
                !poster ||
                !backdrop ||
                !country ||
                !director ||
                !producer ||
                !actor
            ) {
                return res.status(500).send({
                    success: false,
                    message: "Please Provide all fields",
                });
            }
            // ----------------------------------- QUERY SQL -----------------------------------
            const sql =
                "INSERT INTO `films`(`name`, `describe`, `trailer`, `cens`, `genres`, `releases`, `duration`, `poster`, `backdrop`, `country`, `director`, `producer`, `actor`, `created_at`) VALUES (?,?,?,?,?,unix_timestamp(?),unix_timestamp(?),?,?,?,?,?,?, unix_timestamp(NOW()))";
            const [rows, fields] = await pool.query(sql, [
                name,
                describe,
                trailer,
                cens,
                genres,
                releases,
                duration,
                poster[0].originalname,
                backdrop[0].originalname,
                country,
                director,
                producer,
                actor,
            ]);

            // ----------------------------------- STATUS 404 -----------------------------------
            if (!rows) {
                return res.status(404).send({
                    success: false,
                    message: "Error In INSERT QUERY",
                });
            }
            // ----------------------------------- STATUS 201 -----------------------------------
            res.status(201).send({
                success: true,
                message: "New Record Created",
            });
        } catch (error) {
            console.log(error);
            // ----------------------------------- STATUS 500 -----------------------------------
            res.status(500).send({
                status: 500,
                success: false,
                message: "Error in Create API",
                error,
            });
        }
    },
    // ----------------------------------- PUT API -----------------------------------
    update: async (req, res) => {
        const { poster, backdrop } = req.files;
        try {
            const {
                name,
                describe,
                trailer,
                cens,
                genres,
                releases,
                duration,
                country,
                director,
                producer,
                actor,
            } = req.body;
            // ----------------------------------- ID API -----------------------------------
            const { id } = req.params;
            // ----------------------------------- STATUS 404 -----------------------------------
            if (!id) {
                return res.status(404).send({
                    status: 404,
                    success: false,
                    message: "Invalid Id Or Provide id",
                });
            }
            // ----------------------------------- QUERY SQL-----------------------------------
            const sql =
                "UPDATE `films` SET `name`=?,`describe`=?,`trailer`=?,`cens`=?,`genres`=?,`releases`=unix_timestamp(?),`duration`=?,`poster`=?,`backdrop`=?,`country`=?,`director`=?,`producer`=?,`actor`=?, `update_at`=unix_timestamp(NOW()) WHERE id=?";
            const [rows, fields] = await pool.query(sql, [
                name,
                describe,
                trailer,
                cens,
                genres,
                releases,
                duration,
                poster[0].originalname,
                backdrop[0].originalname,
                country,
                director,
                producer,
                actor,
                id,
            ]);
            // ----------------------------------- STATUS 500 -----------------------------------
            if (!rows) {
                return res.status(500).send({
                    success: false,
                    message: "Error In Update Data",
                });
            }
            // ----------------------------------- STATUS 200 -----------------------------------
            res.status(200).send({
                success: true,
                message: "Details Updated",
            });
        } catch (error) {
            console.log(error);
            // ----------------------------------- STATUS 500 -----------------------------------
            res.status(500).send({
                status: 500,
                success: false,
                message: "Error in Update API",
                error,
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
                    status: 404,
                    success: false,
                    message: "Please Provide Id or Valid User Id",
                });
            }
            // ----------------------------------- QUERY SQL-----------------------------------
            const [rows, fields] = await pool.query(
                "DELETE FROM `films` WHERE id = ?",
                [id]
            );
            // ----------------------------------- STATUS 200 -----------------------------------
            res.status(200).send({
                success: true,
                message: "Deleted Successfully",
            });
        } catch (error) {
            console.log(error);
            // ----------------------------------- STATUS 500 -----------------------------------
            res.status(500).send({
                status: 500,
                success: false,
                message: "Error in Delete API",
                error,
            });
        }
    },
};
module.exports = filmController;
