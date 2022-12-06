let knex = require('knex');
const { logError, loggerConsole } = require('../../utils/logger');


class ContainerSQL {
    constructor(tableName, options) {
        this.tableName = tableName;
        this.options = options;
        // console.log('knex(' + this.config + ')(' + this.tableName + ')')
        // this.sqlDatabase = knex(this.config);
    }
    async save(object) {
        return await knex(this.options)(`${this.tableName}`).insert(object)
            .then(() => console.log('Data insertada correctamente'))
            .catch((error) => console.log(`Se ha producido un error al añadir el archivo, ${error}`))
    }
    async getById(id) {
        return await knex(this.options)(`${this.tableName}`).select('*').where('id', id)
            .then(result => {
                return result[0];
            })
            .catch((err) => {
                console.log(`No se ha encontrado un objeto con el id ${id}`);
                console.log(err);
                return null;
            })
    }
    async getAll() {
        return await knex(this.options)(`${this.tableName}`).select('*')
            .then(res => { return res })
            .catch(err => {
                console.log('No se pudieron traer los elementos de la tabla')
                console.log(err)
            })

    }
    async deleteById(id) {
        return await knex(this.options)(`${this.tableName}`).del().where('id', id)
            .then(() => console.log('Data eliminada correctamente'))
            .catch((error) => console.log(`Se ha producido un error al eliminar el archivo, ${error}`))
    }
}

module.exports = ContainerSQL;