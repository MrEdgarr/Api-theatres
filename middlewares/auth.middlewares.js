const jwt = require("jsonwebtoken");

const checkPermisson = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) return res.sendStatus(401);
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (decoded) {
            next();
        }
    } catch (error) {
        return res.json({
            name: error.name,
            message: error.message,
        });
    }
};

const authPage = (permissions) => {
    return (req, res, next) => {
        const userRole = req.body.role;
        if (permissions.includes(userRole)) {
            next();
        } else {
            return res.status(401).json("You do not have access");
        }
    };
};

module.exports = { checkPermisson, authPage };
