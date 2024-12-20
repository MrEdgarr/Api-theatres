const pool = require("../config/database");

const seatController = {
    getAll: async (req, res) => {
        try {
            const [rows, fields] = await pool.query(`SELECT * FROM citys`);

            res.status(200).send({
                success: true,
                content: rows,
            });
        } catch (error) {
            res.status(500).send({
                success: false,
                message: "Errors in Get All API",
            });
        }
    },
};

module.exports = seatController;
