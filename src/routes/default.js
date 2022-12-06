const express = require('express');
const router = express.Router();
const { logWarn, loggerConsole } = require('../utils/logger');

router.get('/', (req, res) => {
    logWarn.warn(`${req.originalUrl} ${req.method}`);
    loggerConsole.warn(`${req.originalUrl} ${req.method}`);
    res.status(404).json({ status: '404' });
})

module.exports = router;