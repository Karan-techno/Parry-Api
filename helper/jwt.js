const jwt = require('jsonwebtoken');
const { CreateSuccessResponse, CreateErrorResponse } = require("../helper/response")
const authMiddleware = (req, res, next) => {

    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader?.split(" ")[1];
        if (!token) res.status(401).send("Unauthorized Access");
        const tokenSecret = 'Parry';
        if (tokenSecret && token) {
            jwt.verify(token, tokenSecret, (err, user) => {
                if (err) res.status(403).send(`Unauthorized Access!  ${err}`);
                req.user = user;
                console.log(user);
                next();
            });
        }
    } catch (error) {
        return res
            .status(500)
            .send(CreateSuccessResponse(error));
    }
};

module.exports = authMiddleware;
