const winston = require('winston');
const path = require('path');


winston.addColors({
    error: 'red',
    warn: 'yellow',
    info: 'cyan'
})

const loggerConsole = winston.createLogger({
    transports: [
        new winston.transports.Console({ level: 'info', colorize: true }),
        new winston.transports.Console({ level: 'warn', colorize: true }),
        new winston.transports.Console({ level: 'error', colorize: true }),
    ]
})

const logWarn = winston.createLogger({
    level: 'warn',
    transports: [
        new winston.transports.File({ filename: path.join(__dirname, '..', 'logs', 'warning.log'), level: 'warn', colorize: true }),
    ]
})

const logError = winston.createLogger({
    level: 'error',
    transports: [
        new winston.transports.File({ filename: path.join(__dirname, '..', 'logs', 'error.log'), level: 'error', colorize: true }),
    ]
})

module.exports = { loggerConsole, logWarn, logError };