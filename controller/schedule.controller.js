const pool = require("../config/database");

const SELECT_SQL =
    "schedules.id, schedules.movie_id, schedules.room_id, " +
    "DATE_FORMAT( CONVERT_TZ(FROM_UNIXTIME(schedules.start_time), @@session.time_zone, '+07:00'), '%H:%i:%s %d/%m/%Y') as start_time," +
    "DATE_FORMAT( CONVERT_TZ(FROM_UNIXTIME(schedules.end_time), @@session.time_zone, '+07:00'), '%H:%i:%s %d/%m/%Y') as end_time ";

const schedulesController = {
    // Lay thong tin lich chieu phim
    getMovieShowtimes: async (req, res) => {
        try {
            const { city_id, cinema_id, movie_id, date_schedule } = req.body;
            const [rows, fields] = await pool.query(
                `SELECT tb1.movieId, tb1.name, tb1.poster, tb1.genres, tb1.cens, tb1.cinemaId, tb1.cinema_name, tb1.cinema_img, tb1.cinema_address, tb1.cityId, tb1.city_name, ( JSON_ARRAYAGG( JSON_OBJECT( 'schedule_id', tb1.schedulesId, 'start_time', tb1.start_time, 'movie_id', tb1.movieId, 'room_id', tb1.roomId, 'end_time', tb1.end_time ) ) ) resultSchedules FROM ( SELECT schedules.id AS schedulesId, schedules.movie_id AS movieId, schedules.room_id AS roomId, schedules.start_time, schedules.end_time, films.name, films.poster, films.genres, films.cens, cinemas.id AS cinemaId, cinemas.cinema_name, cinemas.cinema_img, cinemas.cinema_address, citys.id AS cityId, citys.city_name FROM schedules INNER JOIN rooms ON rooms.id = schedules.room_id INNER JOIN films ON schedules.movie_id = films.id INNER JOIN cinemas ON cinemas.id = rooms.cinema_id INNER JOIN citys ON citys.id = cinemas.city_id 
                WHERE DATE_FORMAT( CONVERT_TZ(FROM_UNIXTIME(schedules.start_time), @@session.time_zone, '+07:00'), '%d/%m') = ?
                ${city_id ? `AND citys.id = ${city_id}` : ``} ${
                    cinema_id ? `AND cinemas.id = ${cinema_id}` : ""
                } ${
                    movie_id ? `AND films.id = ${movie_id}` : ``
                } ) tb1 GROUP BY tb1.movieId`,
                [date_schedule]
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

    // lấy thông tin giờ chiếu phim
    getMovieShowtimeInformation: async (req, res) => {
        try {
            const { city_id, movie_id, date_schedule } = req.body;
            if (!date_schedule) {
                return res.status(500).send({
                    success: false,
                    message: "Không tìm thấy lịch trình ngày",
                });
            }
            const [rows, fields] = await pool.query(
                `SELECT tb2.movieId, tb2.name, tb2.poster, tb2.genres, tb2.cens, ( JSON_ARRAYAGG( JSON_OBJECT( 'cinemaId', tb2.cinemaId, 'cinema_name', tb2.cinema_name, 'cinema_img', tb2.cinema_img, 'cinema_address', tb2.cinema_address, 'resultSchedules', tb2.resultSchedules ) ) ) resultCinema FROM ( SELECT tb1.movieId, tb1.name, tb1.poster, tb1.genres, tb1.cens, tb1.cinemaId, tb1.cinema_name, tb1.cinema_img, tb1.cinema_address, tb1.cityId, tb1.city_name, ( JSON_ARRAYAGG( JSON_OBJECT( 'schedule_id', tb1.schedulesId, 'start_time', tb1.start_time, 'movie_id', tb1.movieId, 'room_id', tb1.roomId, 'end_time', tb1.end_time ) ) ) resultSchedules FROM ( SELECT schedules.id AS schedulesId, schedules.movie_id AS movieId, schedules.room_id AS roomId, schedules.start_time, schedules.end_time, films.name, films.poster, films.genres, films.cens, cinemas.id AS cinemaId, cinemas.cinema_name, cinemas.cinema_img, cinemas.cinema_address, citys.id AS cityId, citys.city_name FROM schedules INNER JOIN rooms ON rooms.id = schedules.room_id INNER JOIN films ON schedules.movie_id = films.id INNER JOIN cinemas ON cinemas.id = rooms.cinema_id INNER JOIN citys ON citys.id = cinemas.city_id 
                WHERE DATE_FORMAT( CONVERT_TZ(FROM_UNIXTIME(schedules.start_time), @@session.time_zone, '+07:00'), '%d/%m') = ?
                ${city_id ? `AND citys.id = ${city_id}` : ``}
                ${movie_id ? `AND films.id = ${movie_id}` : ``}
                ) tb1 GROUP BY tb1.cinemaId, tb1.movieId ) tb2 GROUP BY tb2.movieId`,
                [date_schedule]
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

    // Lấy thông tin lịch chiếu
    getShowtimeInformation: async (req, res) => {
        try {
            const { city_id, movie_id, date_schedule } = req.body;
            if (!date_schedule) {
                return res.status(500).send({
                    success: false,
                    message: "Không tìm thấy lịch trình ngày",
                });
            }
            const [rows, fields] = await pool.query(
                `SELECT tb1.cinema_id, tb1.city_id, tb1.cinema_name, tb1.cinema_address, tb1.cinema_phone, ( JSON_ARRAYAGG( JSON_OBJECT( 'id', tb1.schedule_id, 'movie_id', tb1.movie_id, 'start_time', tb1.start_time, 'end_time', tb1.end_time ) ) ) resultSchedule FROM ( SELECT cinemas.id AS cinema_id, cinemas.city_id, cinemas.cinema_name, cinemas.cinema_address, cinemas.cinema_phone, schedules.id AS schedule_id, schedules.movie_id, schedules.start_time, schedules.end_time, rooms.id AS room_id, rooms.room_name, rooms.room_status FROM cinemas INNER JOIN rooms ON rooms.cinema_id = cinemas.id INNER JOIN schedules ON schedules.room_id = rooms.id INNER JOIN citys ON citys.id = cinemas.city_id 
                WHERE DATE_FORMAT( CONVERT_TZ(FROM_UNIXTIME(schedules.start_time), @@session.time_zone, '+07:00'), '%d/%m') = ?
                ${city_id ? `AND citys.id = ${city_id}` : ""} 
                ${movie_id ? `AND schedules.movie_id  = ${movie_id}` : ""} 
                 ) tb1 GROUP BY tb1.cinema_id`,
                [date_schedule]
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

module.exports = schedulesController;
