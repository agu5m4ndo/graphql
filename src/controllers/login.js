const path = require('path');
const { loggerConsole } = require('../utils/logger')

const getHtml = async(req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'login.html'));
    loggerConsole.info(`${req.originalUrl} ${req.method}`);
}

const sessionData = (req, res) => {
    loggerConsole.info(`${req.originalUrl} ${req.method}`);
    if (req.user) {
        res.status(200).json({ username: req.user.username })
    } else {
        res.status(404).json({ message: 'Session has not been created' })
    }
}

const loginErrorHtml = (req, res) => {
    loggerConsole.info(`${req.originalUrl} ${req.method}`);
    res.sendFile(path.join(__dirname, "..", "public", "login-error.html"))
}

module.exports = {
    getHtml,
    sessionData,
    loginErrorHtml
}