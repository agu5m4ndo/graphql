const { loggerConsole, logWarn, logError } = require('../utils/logger')
const sqlFactory = require('../persistence/factory');
const ProductoDaoMariadb = require('../persistence/DAOs/productoDAO.mariadb');
const SQLFactory = new sqlFactory();
const Product = SQLFactory.create('product');

const getAllProducts = async(req, res) => {
    const result = await Product.getAllProducts();
    loggerConsole.info(`${req.originalUrl} ${req.method}`);
    res.status(200).json({ result })
}

const getOneProduct = async(req, res) => {
    const result = await Product.getProductById(Number(req.params['id']));
    loggerConsole.info(`${req.originalUrl} ${req.method}`);
    res.status(200).json({ result });
}

const postProduct = (req, res) => {
    Product.saveProduct(req.body)
    loggerConsole.info(`${req.originalUrl} ${req.method}`);
    res.status(200).redirect('/');
}

const deleteProduct = async(req, res) => {
    await Product.deleteProductById(Number(req.params['id']))
    loggerConsole.info(`${req.originalUrl} ${req.method}`);
    res.status(200).json({ success: 'true' })
}

module.exports = {
    getAllProducts,
    getOneProduct,
    postProduct,
    deleteProduct
};