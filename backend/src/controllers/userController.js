const userService = require('../services/userService');

const getMe = async (req, res, next) => {
    try {
        const user = await userService.getMe(req.userId);
        res.status(200).json({ success: true, data: user });
    } catch (err) {
        next(err);
    }
};

module.exports = { getMe };
