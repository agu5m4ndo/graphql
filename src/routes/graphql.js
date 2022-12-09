const { graphqlHTTP } = require('express-graphql');
const schema = require('../utils/buildSchema')
const SQLFactory = require('../persistence/factory');
const factory = new SQLFactory();
const productoDaoMariadb = factory.create('product');

const saveProduct = async(object) => {
    return await productoDaoMariadb.saveProduct(object.object);
}

const getProductById = async(id) => {
    return await productoDaoMariadb.getProductById(id.id);
}

const getAllProducts = async() => {
    return await productoDaoMariadb.getAllProducts();
}

const deleteProductById = async(id) => {
    return await productoDaoMariadb.deleteProductById(id.id);
}


const root = {
    saveProduct,
    getProductById,
    getAllProducts,
    deleteProductById
}

module.exports = graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true
})