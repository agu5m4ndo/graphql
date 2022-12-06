const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.CONNECTION_LINK, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

module.exports = mongoose;