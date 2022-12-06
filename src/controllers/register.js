const path = require('path')
const { userExists, saveUser } = require('../services/validation');
const { loggerConsole } = require('../utils/logger');

const getHtml = (req, res) => {
    loggerConsole.info(`${req.originalUrl} ${req.method}`);
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'register.html'))
}

const registerUser = async(req, res) => {
    const { username, password } = req.body;
    loggerConsole.info(`${req.originalUrl} ${req.method}`);
    if (await userExists(username)) {
        console.log(`User ${username} already exists`)
        res.sendFile(path.join(__dirname, '..', '..', 'public', 'register-error.html'))
    } else {

        req.session.username = req.body.username
        await saveUser(username, password)
            //Una vez que el usuario ha sido registrado, podemos pensar que va a tener una sesión asociada
        res.redirect('/')
    }
}

const registerErrorHtml = (req, res) => {
    loggerConsole.info(`${req.originalUrl} ${req.method}`);
    res.sendFile(path.join(__dirname, "..", "public", "register-error.html"))
}

module.exports = { getHtml, registerUser, registerErrorHtml };