module.exports = {
    // eslint-disable-next-line consistent-return
    ensureAuth(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        // eslint-disable-next-line no-else-return
        } else {
            res.status(400).json({
                message: 'User not Authenticated'
            });
        }
    },
};
