const ContainerSQL = require('../containers/ContainerSQL');
const { options } = require('../../utils/sqlite3');
let instance = null;

class MensajeDaoSqlite extends ContainerSQL {
    constructor() {
        super('messages', options);
    }
    async saveMessage(object) {
        return await super.save(object)
    }

    async getMessageById(id) {
        return await super.getById(id);
    }

    async getAllMessages() {
        return await super.getAll();
    }

    async deleteMessageById(id) {
        return await super.deleteById(id);
    }

    static getInstance() {
        if (!instance) instance = new MensajeDaoSqlite();
        return instance;
    }
}

module.exports = MensajeDaoSqlite;