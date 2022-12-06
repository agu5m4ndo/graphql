require('dotenv').config();
const path = require('path')

const options = {
    client: 'sqlite3',
    connection: {
        filename: path.join(__dirname, '..', 'persistence', process.env.FILENAME) //No se si esto es necesario
    },
    useNullAsDefault: true
}

module.exports = { options }