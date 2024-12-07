const pool = require("../config/database");

const bannerController = {
    getAll: async (req, res) => {
        try {
            //  QUERY SQL
            const [rows, fields] = await pool.query(`SELECT * FROM banner`);
            //  STATUS 404
            if (!rows) {
                return res.status(404).send({
                    success: false,
                    message: "Error in Get All API",
                });
            }
            //  STATUS 200
            res.status(200).send({
                message: "success",
                content: rows,
            });
        } catch (error) {
            console.log(error);
            //  STATUS 500
            res.status(500).send({
                success: false,
                message: "Error in Get All API",
                error: error,
            });
        }
    },
};

module.exports = bannerController;
