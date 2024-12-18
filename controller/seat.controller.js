const pool = require("../config/database");
/**
 * lay thong tin rap chieu => city {cinema}
 * lay thong tin lich chieu phim theo rap (where film, cinema, date)  => cinema => { schedule }
 * lay thong tin lich chieu phim theo rap ( cinema, date)  => film => { schedule }
 **/
const seatController = {
    getAll: async (req, res) => {
        try {
            const { room_id } = req.body;
            const [rows, fields] = await pool.query(
                `SELECT tb1.seat_row, ( JSON_ARRAYAGG( JSON_OBJECT( 'id', tb1.seatId, 'seat_type', tb1.seat_type, 'room_id', tb1.roomId, 'seat_number', tb1.seat_number, 'seat_status', tb1.seat_status ) ) ) seatResult from ( SELECT seats.id AS seatId, seats.seat_type,seats.seat_row,seats.seat_number,seats.seat_status, rooms.id AS roomId FROM seats INNER JOIN rooms ON rooms.id = seats.room_id WHERE rooms.id = ? ) tb1 GROUP BY tb1.seat_row, tb1.roomId`,
                [room_id]
            );

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
