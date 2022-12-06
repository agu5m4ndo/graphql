const { logError, loggerConsole } = require('../../utils/logger');
const ContainerSQL = require('../containers/ContainerSQL');
const { options } = require('../../utils/mariadb')
let instance = null;

class ProductoDaoMariadb extends ContainerSQL {
    constructor() {
        super('products', options);
    }
    async saveProduct(object) {
        let message = "";
        if (object.name == '') {
            message = "Name is blank";
        } else {
            if (object.price == '') {
                message = "Price is blank";
            } else {
                if (object.thumbnail == '') {
                    message = "Thumbnail is blank";
                }
            }
        }
        if (message != "") {
            loggerConsole.error(message);
            logError.error("Product error: " + message);
        } else {
            return await super.save(object);
        }
    }

    async getProductById(id) {
        return await super.getById(id);
    }

    async getAllProducts() {
        return await super.getAll();
    }

    async deleteProductById(id) {
        return await super.deleteById(id);
    }

    static getInstance() {
        if (!instance) instance = new ProductoDaoMariadb();
        return instance;
    }
}

module.exports = ProductoDaoMariadb;